const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

const rootPath = './src/pages';
const domain = 'https://amplion.eu';

function buildSitemap(startPath) {
    let sitemap = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' })
        .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    function walkDirectory(dir) {
        let files = fs.readdirSync(dir);

        for (let file of files) {
            let fullPath = dir + '/' + file;
            let stat = fs.statSync(fullPath);

            if (stat && stat.isDirectory()) {
                walkDirectory(fullPath);
            } else if (file === 'index.html') {
                let urlPath = fullPath.replace(rootPath, '').replace('/index.html', '');
                sitemap.ele('url').ele('loc', domain + urlPath);
            }
        }
    }

    walkDirectory(startPath);
    return sitemap.end({ pretty: true });
}

fs.writeFileSync('./dist/sitemap.xml', buildSitemap(rootPath));
