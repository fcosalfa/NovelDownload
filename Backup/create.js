const fs = require('fs');

const paragraphs = [];

// Creat a new empty text file
fs.writeFile('new-file.txt', paragraphs.join('\n'), {encoding: 'utf8'}, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
