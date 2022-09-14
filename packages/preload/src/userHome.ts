import { mkdirSync, existsSync, readFile } from 'node:fs';
import { writeFile, readdir } from 'node:fs/promises';
import {compileAsync} from 'sass';
import variablesTpl from '../sass-template/variables.scss?raw';
import stylesTpl from '../sass-template/styles.scss?raw';
import operatorsTpl from '../sass-template/operators.scss?raw';
import nestingTpl from '../sass-template/nesting.scss?raw';
import mixinsTpl from '../sass-template/mixins.scss?raw';
import extendTpl from '../sass-template/extend.scss?raw';
import baseTpl from '../sass-template/_base.scss?raw';
import {readdirSync} from './index';

export function getUserHome(): string {
  const userHome = process.env.HOME;

  if (!userHome) {
    throw new Error('找不到用户目录');
  }

  return userHome!;
}

const folderName = '.shenxiang-sass-playground';

export const workspace = `${getUserHome()}/${folderName}`;

export function setupRootFolder(): boolean {
  // 检测目录是否已经存在
  const fullPathName = `${getUserHome()}/${folderName}`;

  if (existsSync(fullPathName)) {
    return false
  }

  // 如果不存在，则创建
  mkdirSync(`${getUserHome()}/${folderName}`);

  return true;
}

export async function setupSassTemplate(): Promise<boolean> {
  const tplMap = {
    '_base.scss': baseTpl,
    'extend.scss': extendTpl,
    'mixins.scss': mixinsTpl,
    'nesting.scss': nestingTpl,
    'operators.scss': operatorsTpl,
    'styles.scss': stylesTpl,
    'variables.scss': variablesTpl,
  };

  try {
    await Promise.all(Object.entries(tplMap).map(([filename, filecontent]) => {
      return writeFile(`${getUserHome()}/${folderName}/${filename}`, filecontent);
    }));

    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

export async function writeScssFile(filename: string, filecontent: string) {
  return writeFile(`${getUserHome()}/${folderName}/${filename}`, filecontent);
}

export async function writeScssFileAndCompile(filename: string, filecontent: string): Promise<string> {
  const sassFileName = `${getUserHome()}/${folderName}/${filename}`;
  await writeFile(sassFileName, filecontent);
  const result = await compileAsync(sassFileName, {});
  return result.css;
}

export async function getAllScssFiles() {
  const filenames = await readdir(workspace)

  const pathMap = (() => {
    const result: any = {};
    filenames.forEach(filename => {
      result[filename] = `${workspace}/${filename}`;
    })
    return result;
  })();

  return {
    filenames,
    pathMap,
  }
}
