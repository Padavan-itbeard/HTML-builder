const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname);
const distPath = path.join(srcPath, 'project-dist');
const stylesPath = path.join(srcPath, 'styles');
const outStylePath = path.join(distPath, 'style.css');
const assetsPath = path.join(srcPath, 'assets');
const outAssetsPath = path.join(distPath, 'assets');
const srcHtmlPath = path.join(srcPath, 'template.html');
const outHtmlPath = path.join(distPath, 'index.html');
const componentsPath = path.join(srcPath, 'components');

async function build() {
  await createOutDir(distPath);
  await buildCss(stylesPath, outStylePath);
  await copyAssets(assetsPath, outAssetsPath);
  await buildHtml(srcHtmlPath, outHtmlPath);
}

build();

async function createOutDir(pathName) {
  await fs.promises.mkdir(pathName, { recursive: true });
}

async function buildCss(srcStylesPath, outStylePath) {
  const writeStyleStream = fs.createWriteStream(outStylePath);

  fs.promises.readdir(srcStylesPath).then(async (files) => {
    for (const file of files) {
      const filePath = path.join(srcStylesPath, file);
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName);

      if (ext === '.css') {
        const readStylesStream = fs.createReadStream(filePath, 'utf-8');

        readStylesStream.pipe(writeStyleStream);
      }
    }
  });
}

async function copyAssets(srcAssetsPath, outAssetsPath) {
  await createOutDir(outAssetsPath);

  const files = await fs.promises.readdir(srcAssetsPath, {
    withFileTypes: true,
  });

  for (const file of files) {
    const sourcePath = path.join(srcAssetsPath, file.name);
    const destinationPath = path.join(outAssetsPath, file.name);

    if (file.isDirectory()) {
      await copyAssets(sourcePath, destinationPath);
    } else {
      await fs.promises.copyFile(sourcePath, destinationPath);
    }
  }
}

async function buildHtml(srcHtml, outHtml) {
  const template = await fs.promises.readFile(srcHtml, 'utf-8');
  const templates = [];

  await fs.promises.readdir(componentsPath).then(async (components) => {
    for (const component of components) {
      const componentPath = path.join(componentsPath, component);
      const ext = path.extname(componentPath);
      const componentName = path.basename(componentPath).replace(ext, '');
      const componentTag = `{{${componentName}}}`;
      const content = await fs.promises.readFile(componentPath, 'utf-8');

      templates.push({ tag: componentTag, content });
    }
  });

  const result = templates.reduce(
    (acc, { tag, content }) => acc.replace(tag, `\n${content}\n`),
    template,
  );

  await fs.promises.writeFile(outHtml, result, 'utf-8');
}
