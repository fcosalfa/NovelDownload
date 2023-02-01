const epub = require('epub-gen');
const fs = require('fs');
const readline = require('readline');

const content = [];
let data;
let ChapterCount = 0;

// Read strem data from Text file
let stream = fs.createReadStream('new-file.txt');

// Start stream 
let rl = readline.createInterface({
  input: stream
});

// Read Line by line
rl.on('line', (line) => {
  // Check the title of the chapter 
  if (line.startsWith('# ')) {
    // Set data to empty string
    data = "";

    // Construct a new object for this chapter
    content.push({
      title : line,
      data : data
    });
 
    // Chapter counter
    ChapterCount = ChapterCount + 1;

  } else {
    // Add p element to this line
    data = data + '<p>' + line + '</p>';

    // Join the text in this chapter
    content[ChapterCount - 1].data = data;
  }
});

// End of reading
rl.on('close', () => {
  // Create Meta data for Epub
  const options = {
    title: 'ASTRAL PET STORE',
    author: 'Ancient Xi, Gu Xi, 古羲',
    output: './Astral Pet Store 1581 (End).epub',
    content : content
  }; 

  // Generate Epub file
  new epub(options).promise.then(() => console.log('Done'));

  // Shutdown NodeJS
  // process.exit(0);
});


