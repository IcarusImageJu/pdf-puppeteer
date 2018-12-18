const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require ('path');

const data = require('./data.json');

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

(async function(){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('quote', data);

        await page.setContent(content);
        await page.addStyleTag({path: './static/css/quote.css'});
        await page.emulateMedia('screen');
        await page.pdf({
            path:'mypdf.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('done');
        await browser.close();
        process.exit();

    } catch (error) {
        console.log('our error:',error);
    }
})();