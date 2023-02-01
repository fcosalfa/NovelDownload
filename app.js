const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to crawl
const baseUrl = 'https://novelfull.com';

// Define the first chapter 
const url = 'https://novelfull.com/astral-pet-store/chapter-1.html';

let TotalChap = 0;
let content;

function crawlPage(url) {
	// Make an HTTP request to the website
	request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {

    	content = "";

      	// Load the HTML into cheerio
      	const $ = cheerio.load(html);

		// Select Chapter title
		const ChapterTitle = $('.chapter-text').text() + '\n'; 
		content = '# ' + content + ChapterTitle;

		// Select all p elements
		const paragraphs = $('#chapter-content p');

		// Iterate over the elements
		paragraphs.each((i, element) => {
		  	// Get the text content of the element
		  	const text = $(element).text();
          	content = content + text + '\n';
		});

		// Write text to the file
		fs.appendFile('new-file.txt', content, {encoding: 'utf8'}, (err) => {
			if (err) throw err;
		});

		// Look for a link to the next page
		const nextPageLink = $('#next_chap');

		// If there is a link to the next page
		if (nextPageLink.length > 0) {

			// Get the href attribute of the link
			const nextPageUrl = nextPageLink.attr('href');

			// Chapter counter
			TotalChap = TotalChap + 1;

			console.log(TotalChap);

			// Crawl the next page
		    crawlPage(baseUrl + nextPageUrl);
			
      	}
    } else {
    	console.log(error);
    	console.log(url);
    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);
