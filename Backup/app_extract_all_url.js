const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let content = "";

function newCrawl(){

	const htmlContent = fs.readFileSync('fabricate.html', 'utf8');

    const $ = cheerio.load(htmlContent);

    const chapterRows = $('.panel-body .list-chapter li a').each((index, element) => {
    	const href = $(element).attr('href'); 
		const title = $(element).attr('title');

		//console.log(`Chapter ${index + 1} Link:`, href);

		content = '# ' + title + '\n' + href + '\n';

		fs.appendFile('new-file.txt', content, {encoding: 'utf8'}, (err) => {
			if (err) throw err;
		});
    });

}

newCrawl()