import colours from "./colours.json" with { type: "json" }
import { Canvas, loadImage } from "skia-canvas"
import path from "node:path"
import fs from "node:fs"

const getFiles = async function*(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

const inDir = "./source"
const outDir = "./output"

if (fs.existsSync(outDir)) {
  const dirents = await fs.promises.readdir(outDir, { withFileTypes: true })
  for (const dirent of dirents) {
    const fullPath = path.join(outDir, dirent.name)
    if (dirent.name === ".git") continue
    if (dirent.isDirectory()) {
      await fs.promises.rm(fullPath, { recursive: true, force: true })
    } else {
      await fs.promises.unlink(fullPath)
    }
  }
}

for await (const filePath of getFiles(inDir)) {
  const input = path.relative(inDir, filePath)
  if (!input.includes("{{colour}}")) {
    const output = path.join(outDir, input)
    await fs.promises.mkdir(path.dirname(output), { recursive: true })
    await fs.promises.copyFile(filePath, output)
    console.log(`Copied "${input}"`)
    continue
  }
  let file
  if (filePath.endsWith(".png")) {
    file = await loadImage(filePath)
  } else {
    file = fs.readFileSync(filePath, "utf-8")
  }
  for (const [colour, hex] of Object.entries(colours)) {
    const output = path.join(outDir, input.replaceAll("{{colour}}", colour))
    await fs.promises.mkdir(path.dirname(output), { recursive: true })
    if (filePath.endsWith(".png")) {
      const canvas = new Canvas(file.width, file.height)
      const ctx = canvas.getContext("2d")
      ctx.drawImage(file, 0, 0)
      ctx.fillStyle = hex
      ctx.globalCompositeOperation = "multiply"
      ctx.fillRect(0, 0, file.width, file.height)
      ctx.globalCompositeOperation = "destination-in"
      ctx.drawImage(file, 0, 0)
      canvas.saveAs(output)
    } else {
      fs.writeFileSync(output, file.replaceAll("{{colour}}", colour).replaceAll("{{hex}}", hex))
    }
    console.log(`Created "${output}"`)
  }
}