import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from "handlebars";
import { createFolder } from '../../utils/index.ts';

let globalEditFormSuffix = 'EditModalForm';

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = 'temp'

const distPath = path.join(process.cwd(), DIST_DIR);

createFolder(distPath);

const configText = fs.readFileSync('table-list.template.json', { encoding: 'utf8' });
const config = JSON.parse(configText);
const pageName = `${config.name}Page`;
const typeText = fs.readFileSync(path.join(__dirname, './template/type.txt'), { encoding: 'utf8' });
const typeTemplate = Handlebars.compile(typeText);
const serviceText = fs.readFileSync(path.join(__dirname, './template/service.txt'), { encoding: 'utf8' });
const serviceTemplate = Handlebars.compile(serviceText);
const mockText = fs.readFileSync(path.join(__dirname, './template/mock.txt'), { encoding: 'utf8' });
const mockTemplate = Handlebars.compile(mockText);
const pageText = fs.readFileSync(path.join(__dirname, './template/page.txt'), { encoding: 'utf8' });
const pageTemplate = Handlebars.compile(pageText);
const indexText = fs.readFileSync(path.join(__dirname, './template/index.txt'), { encoding: 'utf8' });
const indexTemplate = Handlebars.compile(indexText);

if (!config.rowKey) {
  config.rowKey = 'id';
  if (Array.isArray(config.columns)) {
    config.columns.unshift({ "dataIndex": "id", "title": "id", "type": "number" })
  }
}

createFolder(path.join(distPath, pageName));

console.log('生成类型文件...');
fs.writeFileSync(path.join(distPath, pageName, 'data.d.ts'), typeTemplate(config));

if (config.tabs) {
  const constantsText = fs.readFileSync(path.join(__dirname, './template/constants.txt'), { encoding: 'utf8' });
  const constantsTemplate = Handlebars.compile(constantsText);
  console.log('生成常量文件...');
  fs.writeFileSync(path.join(distPath, pageName, 'constants.ts'), constantsTemplate(config));

  const statusModalText = fs.readFileSync(path.join(__dirname, './template/statusModal.txt'), { encoding: 'utf8' });
  const statusModalTemplate = Handlebars.compile(statusModalText);
  console.log('生成状态修改弹框...');
  fs.writeFileSync(path.join(distPath, pageName, `${config.name}StatusModal.tsx`), statusModalTemplate(config));
}

console.log('生成接口文件...');
fs.writeFileSync(path.join(distPath, pageName, 'service.ts'), serviceTemplate(config));

console.log('生成mock文件...');
fs.writeFileSync(path.join(distPath, pageName, '_mock.ts'), mockTemplate(config));

if (config.useDrawerForm) {
  globalEditFormSuffix = 'EditDrawerForm';
  Handlebars.registerPartial('globalEditFormSuffix', globalEditFormSuffix);
  const formText = fs.readFileSync(path.join(__dirname, './template/drawer.txt'), { encoding: 'utf8' });
  const formTemplate = Handlebars.compile(formText);

  console.log('生成编辑抽屉组件...');
  fs.writeFileSync(path.join(distPath, pageName, `${config.name}${globalEditFormSuffix}.tsx`), formTemplate(config));
} else {
  Handlebars.registerPartial('globalEditFormSuffix', globalEditFormSuffix);
  const formText = fs.readFileSync(path.join(__dirname, './template/modal.txt'), { encoding: 'utf8' });
  const formTemplate = Handlebars.compile(formText);

  console.log('生成编辑弹框组件...');
  fs.writeFileSync(path.join(distPath, pageName, `${config.name}${globalEditFormSuffix}.tsx`), formTemplate(config));
}

console.log('生成页面组件...');
fs.writeFileSync(path.join(distPath, pageName, `${config.name}Page.tsx`), pageTemplate(config));

console.log('生成index文件...');
fs.writeFileSync(path.join(distPath, pageName, 'index.ts'), indexTemplate(config));
