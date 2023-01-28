const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to crawl
const baseUrl = 'https://noblemtl.com';

// Define the first chapter 
const url = 'https://noblemtl.com/logging-10000-years-into-the-future-chapter-1';

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
		const ChapterTitle = $('h1.entry-title').text();
		const startIndex = ChapterTitle.indexOf("chapter");
		const GetChapter = ChapterTitle.slice(startIndex) + '\n';
		content = content + GetChapter;

		// Select all p elements
		const paragraphs = $('.entry-content p');

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
		// const nextPageLink = $('.navimedia .left .');
		const nextPageLink = $('.naveps .nvs:eq(2) a');

		// If there is a link to the next page
		if (nextPageLink.length > 0) {

			// Get the href attribute of the link
			const nextPageUrl = nextPageLink.attr('href');

			// Chapter counter
			TotalChap = TotalChap + 1;

			console.log(TotalChap);

			// Crawl the next page
		    crawlPage(nextPageUrl);
			
      	}
    } else {
    	console.log(error);
    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);
