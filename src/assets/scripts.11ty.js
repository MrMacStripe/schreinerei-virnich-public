// Documentation
// https://blog.r0b.io/post/bundle-javascript-with-eleventy-and-esbuild/
// 

const esbuild = require('esbuild')
const { NODE_ENV = 'production' } = process.env

const isProduction = NODE_ENV === 'production'

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.build({
      entryPoints: ['src/main.js'],
      bundle: true,
      minify: isProduction,
      outdir: '_site/',
      sourcemap: !isProduction,
      target: 'esnext'
    })
  }
}