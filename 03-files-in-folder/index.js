const fs = require('fs').promises;
const path = require('path');

const absPath = path.join(__dirname, 'secret-folder');

const printFilesInfo = async (folder) => {
  try {
    const files = await fs.readdir(folder);

    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);

      if (!stats.isDirectory()) {
        const ext = path.extname(filePath);
        const fileName = file.replace(ext, '');
        const sizeKb = Number(stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${ext.replace(/\./, '')} - ${sizeKb} kB`);
      }
    }
  } catch (err) {
    console.error('Error reading folder contents:', err);
  }
};

printFilesInfo(absPath);
