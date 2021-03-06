'use strict'

const { readFile } = require('fs').promises
const path = require('path')

const getPrism = readFile(path.resolve(__dirname, 'prism.js'))
const getTheme = require('./theme')
const getHtml = require('./html')

const { injectScripts, injectStyles } = require('@browserless/goto')

module.exports = async (page, response, { codeScheme, styles, scripts, modules }) => {
  const [theme, payload, prism] = await Promise.all([
    getTheme(codeScheme),
    response.json(),
    getPrism
  ])

  const html = getHtml(payload, { prism, theme })
  await page.setContent(html)

  await Promise.all(
    [
      modules && injectScripts(page, modules, { type: 'modules' }),
      scripts && injectScripts(page, scripts),
      styles && injectStyles(page, styles)
    ].filter(Boolean)
  )
}
