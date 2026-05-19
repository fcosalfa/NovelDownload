const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to crawl
// const baseUrl = 'https://novelnext.com/'; // https://novelnext.dramanovels.io

// Define the first chapter 
const url = 'https://novelnext.dramanovels.io/nc/i-fabricated-the-techniques-but-my-disciple-really-mastered-them/chapter-1-chapter-1-i-didnt-want-to-take-a-disciple-but-he-gave-too-much1';

let TotalChap = 1;
//let RealChap = 524;
let content;

function crawlPage(url) {
	// Make an HTTP request to the website
	request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {

    	content = "";

      	// Load the HTML into cheerio
      	const $ = cheerio.load(html);

		// Select Chapter title
		//const ChapterTitle = $('a.chr-title .chr-text').text().trim();
		//var startIndex = ChapterTitle.indexOf('Chapter');
		//var chapterText = ChapterTitle.substring(startIndex)  + '\n'; ; 		
		//content = '# ' + content + chapterText;

		content = '# Chapter ' + TotalChap + '\n';

		// Select all p elements
		const paragraphs = $('#chr-content p');

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
		const nextPageLink = $('#next_chap');

		// If there is a link to the next page
		if (nextPageLink.length > 0) {

			// Get the href attribute of the link
			const nextPageUrl = nextPageLink.attr('href');

			// Debug
			console.log("Extract Chapter No. : " + TotalChap);
			console.log("Extract URL : " + nextPageUrl);

			// Chapter counter
			TotalChap = TotalChap + 1;

			crawlPage(nextPageUrl);

			// Check the length of the URL
			// Shorten URL
			/*
			if(nextPageUrl.length > 120){
				TinyURL.shorten(nextPageUrl, function(nextUrl, err) {
					crawlPage(nextUrl);
				});
			} else {
				crawlPage(nextPageUrl);
			}
			*/
			
      	}
    } else {
	    	console.log(error);
	    	console.log("Error When trying to read : " + url);
    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);
