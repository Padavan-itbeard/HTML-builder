const fs = require('fs').promises;
const path = require('path');

const copyDir = async (inputDir, outDir) => {
  try {
    await fs.mkdir(outDir, { recursive: true });
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      const fileSrcPath = path.join(inputDir, file);
      const fileDstPath = path.join(outDir, file);

      fs.copyFile(fileSrcPath, fileDstPath);
      console.log(`${file} copied`);
    }
  } catch (err) {
    console.error('Error reading folder contents:', err);
  }
};

const sourceDir = path.join(__dirname, 'files');
const distDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, distDir);
