const fs = require('fs');
const path = require('path');

const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));
const sayBye = () => {
  stdout.write('\nThank you for using the program. Goodbye!');
  exit();
};

process.on('SIGINT', sayBye);

stdout.write(
  'Please, enter your messages (type "exit" or press Ctrl+C to quit)::\n',
);
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    sayBye();
  }
  output.write(data);
});
