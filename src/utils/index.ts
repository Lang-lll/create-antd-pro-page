import fs from 'node:fs'

export function createFolder(dir) {
  if (!fs.existsSync(dir)) {
    console.log('创建文件夹: ', dir);
    fs.mkdirSync(dir);
  }
}