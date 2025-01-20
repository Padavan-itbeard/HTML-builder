const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const outputStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.promises.readdir(stylePath).then(async (files) => {
  for (const file of files) {
    const filePath = path.join(stylePath, file);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);

    if (ext === '.css') {
      const inputStream = fs.createReadStream(filePath);

      inputStream.pipe(outputStream);
    }
  }
});
