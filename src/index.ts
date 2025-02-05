import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from "handlebars";
import { createFolder } from './utils/index.ts';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

createFolder(path.join(__dirname, './dist'))

const configText = fs.readFileSync('pageTemplate.json', { encoding: 'utf8' });
const config = JSON.parse(configText);
const pageName = `${config.name}Page`;
const typeText = fs.readFileSync(path.join(__dirname, './template/type.txt'), { encoding: 'utf8' });
const typeTemplate = Handlebars.compile(typeText);
const serviceText = fs.readFileSync(path.join(__dirname, './template/service.txt'), { encoding: 'utf8' });
const serviceTemplate = Handlebars.compile(serviceText);
const formText = fs.readFileSync(path.join(__dirname, './template/modal.txt'), { encoding: 'utf8' });
const formTemplate = Handlebars.compile(formText);
const pageText = fs.readFileSync(path.join(__dirname, './template/page.txt'), { encoding: 'utf8' });
const pageTemplate = Handlebars.compile(pageText);
const indexText = fs.readFileSync(path.join(__dirname, './template/index.txt'), { encoding: 'utf8' });
const indexTemplate = Handlebars.compile(indexText);

if (!config.rowKey) {
  config.rowKey = 'id';
}

createFolder(path.join(__dirname, './dist', pageName))

console.log('生成类型文件...')
fs.writeFileSync(path.join(__dirname, './dist', pageName, 'data.d.ts'), typeTemplate(config))

console.log('生成接口文件...')
fs.writeFileSync(path.join(__dirname, './dist', pageName, 'service.ts'), serviceTemplate(config))

console.log('生成编辑弹框组件...')
fs.writeFileSync(path.join(__dirname, './dist', pageName, `${config.name}ModalForm.tsx`), formTemplate(config))

console.log('生成页面组件...')
fs.writeFileSync(path.join(__dirname, './dist', pageName, `${config.name}Page.tsx`), pageTemplate(config))

console.log('生成index文件...')
fs.writeFileSync(path.join(__dirname, './dist', pageName, 'index.ts'), indexTemplate(config))
