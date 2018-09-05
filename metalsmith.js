var Metalsmith = require('metalsmith');

// Plugins
var markdown = require('metalsmith-markdown');
var markdownPrecompiler = require('metalsmith-markdown-precompiler');
var sass = require('metalsmith-sass');
var layouts = require('metalsmith-layouts');
var discoverHelpers = require('metalsmith-discover-helpers');
var discoverPartials = require('metalsmith-discover-partials');
var path = require('path');
var paths = require('metalsmith-paths');
var metadata = require('metalsmith-collections');
var json_to_files = require('metalsmith-json-to-files');
var moonSearch = require('./metalsmith-moonsearch/metalsmith-moonsearch.js');

// Data
var blogData = require('./src/blog/data.json');
var boxesData = require('./src/boxes/data.json');
var careersData = require('./src/careers/data.json');
var docsData = require('./src/docs/data.json');
var tutorialsData = require('./src/tutorials/data.json');

function app(clean) {
  return Metalsmith(__dirname)
  .source(path.join('./', 'src'))
  .destination('build/')
  .clean(clean)
  .metadata({
    blog: blogData,
    boxes: boxesData,
    careers: careersData,
    docs: docsData,
    tutorials: tutorialsData
  })
  .use(discoverHelpers({
    directory: 'helpers',
    pattern: /\.js$/
  }))
  .use(discoverPartials({
    directory: 'partials',
    pattern: /\.hbs$/
  }))
  .use(json_to_files({
    source_path: './src/boxes/'
  }))
  .use(paths())
  .use(markdownPrecompiler({
    engine: "handlebars",
    pattern: /\.md$/,
    partialsPath: './../partials',
    partials: ["partial"]
  }))
  .use(markdown({
    renderer: require('./renderers/markdown.js')
  }))
  .use(layouts({
    "default": "single-post.hbs",
    "pattern": "blog/*.html"
  }))
  .use(layouts({
    "default": "single-career.hbs",
    "pattern": "careers/*.html"
  }))
  .use(layouts({
    "default": "single-tutorial.hbs",
    "pattern": "tutorials/*.html"
  }))
  .use(layouts())
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'css/'
  }))
  .use(moonSearch());
}

module.exports = app;
