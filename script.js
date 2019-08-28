const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const config = require('./config')

const {
    resourcesPath,
    outPath,
    searchTitleValue,
    searchBreadcrumbsValue
} = config

function copyToOut (dirname) {
    const copiedPath = path.join(outPath, dirname)
    const originPath = path.join(resourcesPath, dirname)
    fs.existsSync(copiedPath) || fs.mkdirSync(copiedPath, { recursive: true })
    const files = fs.readdirSync(originPath, { withFileTypes: true })
    for (let file of files) {
        if (file.isDirectory()) {
            copyToOut(path.join(dirname, file.name))
        } else {
            fs.copyFileSync(path.join(originPath, file.name), path.join(copiedPath, file.name))
        }
    }
}

function htmlToPage (html) {
    const $ = cheerio.load(html)
    // prefix 지움
    const title = $('title').text()
      .replace(searchTitleValue, '')
      .replace('/', _ => `|`) // path로 인식
      .trim()
    const breadcrumbs = $('#breadcrumbs a').map((_, it) => $(it).text()).get()
    const images = $('img').map((_, it) => $(it).attr('src')).get()
    const content = `<html><head><title>${title}</title></head><body>${$('#content').toString()}</body></html>`
    const filename = breadcrumbs
      .map(it => it.replace(searchBreadcrumbsValue, ''))
      .filter(it => it)
      .concat(`${title}.html`)
      .join(' > ')
    return {
        filename,
        title,
        content,
        images,
    }
}

function dirToPage (dirname) {
    // All files
    const pagePath = path.join(resourcesPath, dirname)
    const files = fs.readdirSync(pagePath, { withFileTypes: true })
    const pages = files
      .filter(it => it.isFile() && /.+\.html$/.test(it.name))
      .map(({ name }) => fs.readFileSync(path.join(pagePath, name), 'utf8'))
      .map(html => htmlToPage(html))

    files
      .filter(it => it.isDirectory())
      .forEach(({ name }) => copyToOut(path.join(dirname, name)))

    fs.existsSync(outPath) || fs.mkdirSync(outPath)
    for (let page of pages) {
        const { filename, content } = page
        fs.writeFileSync(path.join(outPath, dirname, filename), content)
    }

}

fs.readdirSync(resourcesPath, { withFileTypes: true })
  .filter(it => it.isDirectory())
  .map(it => it.name)
  .forEach(dirToPage)

