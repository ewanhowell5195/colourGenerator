
# colourGenerator

A Node.js utility to generate colour variants of files by processing both file names and contents according to a colour configuration.

## Requirements

- Node.js 22 or later

## Installation

Navigate to the project directory in your terminal and run:
```bash
npm i
```

## Usage

1. Check `source` folder and `colours.json` for example structure and configuration
2. Run the generator:
```bash
node index.js
```

## How it works

### File Processing

- Files are processed from the `source` directory and output to the `output` directory
- Maintains folder structure from source
- Processes all files recursively through subdirectories

### Colour Replacement

#### File/Folder Names
- Use `{{colour}}` in file/folder names to generate variants for each colour
- Example: `config-{{colour}}.json` becomes:
  - `config-blue.json`
  - `config-red.json`
  - `config-dark.json`

#### File Contents
- `{{colour}}` - replaced with the colour name
- `{{hex}}` - replaced with the hex code
- Files without `{{colour}}` in their name will be copied but won't have their contents processed

#### PNG Files
- PNG files containing `{{colour}}` in their name will have their colours multiplied by the specified colour

## Examples

Source structure:
```
source/
  ├── assets/
  │   ├── settings-{{colour}}.json
  │   └── theme-{{colour}}.properties
  │   └── texture-{{colour}}.png
  └── model.json
```

Output structure (with blue, red, dark colours):
```
output/
  ├── assets/
  │   ├── settings-blue.json
  │   ├── settings-red.json
  │   ├── settings-dark.json
  │   ├── theme-blue.properties
  │   ├── theme-red.properties
  │   └── theme-dark.properties
  │   ├── texture-blue.png
  │   ├── texture-red.png
  │   └── texture-dark.png
  └── model.json
```