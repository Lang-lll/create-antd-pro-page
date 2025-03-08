import fs from 'node:fs';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const allTemplate = ['table-list']
let templateType = 'table-list'

const args = process.argv.slice(2)

for (let i = 0; i < args.length; i++) {
  const templateTypeVal = getArgsValueStr(args[i], 'template')

  if (allTemplate.includes(templateTypeVal)) {
    templateType = templateTypeVal
  }
}

async function main() {
  if (fs.existsSync(`${templateType}.template.json`)) {
    await import(`./core/${templateType}/index.ts`)
  } else {
    console.log('没有模板配置文件')
  }
}

main()

function getArgsValueStr(str, name) {
  if (typeof str === 'string' && str.match(new RegExp(name))) {
    const options = str.split('=')
    if (options && options[1]) {
      return options[1]
    }
  }

  return ''
}