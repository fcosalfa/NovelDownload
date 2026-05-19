import { default as epub } from 'epub-gen-memory';
import fs from 'node:fs';
import readline from 'node:readline';

const content = [];
let data;
let chapterCount = 0;

// Read stream data from Text file
let stream = fs.createReadStream('new-file.txt');

let rl = readline.createInterface({
  input: stream
});

rl.on('line', (line) => {
  if (line.startsWith('# ')) {
    data = "";
    content.push({
      title: line.replace('# ', ''), 
      content: data // Changed from 'data' to 'content'
    });
    chapterCount++;
  } else if (chapterCount > 0) {
    data = data + '<p>' + line + '</p>';
    // Update the reference here as well
    content[chapterCount - 1].content = data; 
  }
});

rl.on('close', () => {
  const options = {
    title: 'The Clan Master Cant possibly Be A Mortal',
    author: 'N/A'
  }; 

  const outputPath = './The Clan Master Cant possibly Be A Mortal - 2204 (End).epub';

  // Use epub.default if epub is an object, otherwise use epub directly
  const epubGenerator = typeof epub === 'function' ? epub : epub.default;

  epubGenerator(options, content)
    .then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log('Done!');
    })
    .catch((err) => {
      console.error('Error:', err);
    });
});

