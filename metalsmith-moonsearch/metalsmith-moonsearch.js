const fs = require('fs');
var path = require('path');

// To use jQuery in Node.
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
var $ = require("jquery")((new JSDOM('')).window);

function metalsmithMoonsearch(options) {
  return function(files, metalsmith, done) {
    var docsSearchIndex = [];
    var docsResults = {};

    // Iterate over files.
    for (filename in files) {
      var title = 'Documentation';
      var contents = files[filename].contents;
      
      if (files[filename].layout === 'docs.hbs') {
        // File is from documentation.

        if ('title' in files[filename]) {
          title = files[filename].title;
        }

        docsResults[title] = files[filename];

        // Decode contents to HTML string,
        // get only the body copy,
        // then remove all HTML tags.
        contents = contents.toString();
        var excerpt = $(contents).find('p:first').text();
        docsResults[title].excerpt = excerpt.length ? excerpt.substring(0, excerpt.length - 1) + '...' : excerpt;
        contents = $(contents).find('.docs-content').text().replace(/[\r\n]+/g,'');
    
        // Push data to docs index.
        docsSearchIndex.push({
          title: title,
          contents: contents
        });
      }
    }

    // Create js file for the search.
    const fileContents = `
    var docsSearchIndex = ${JSON.stringify(docsSearchIndex)};
    var docsResults = ${JSON.stringify(docsResults)};
    
    jQuery(function($) {
      var idx = lunr(function() {
        this.ref('title', { boost: 10 });
        this.field('contents');

        docsSearchIndex.forEach(function(doc) {
          this.add(doc)
        }, this);
      });

      var urlParams = window.location.search;

      var resultsHtml = '<div class="row result-row"><div class="col"><h3><i class="fas fa-ban"></i>&nbsp;&nbsp;<strong>No results found!</strong> Please try another search.</h3></div></div>';

      if (urlParams.length) {
        var queryStringElements = urlParams.split('=');
        var query = queryStringElements[queryStringElements.length - 1];

        if (query) {
          $('#searchQuery').text(query);
          $('#searchInput').val(query);
          var results = idx.search(query);

          if (results.length) {
            resultsHtml = '';
  
            for (var i = 0; i < results.length; i++) {
              var rowHtml = \`
              <div class="row">
                <div class="col">
                  <a href="\${docsResults[results[i].ref].path.dhref}\${docsResults[results[i].ref].path.name}">
                    <h3>\${results[i].ref}</h3>
                    <p>\${docsResults[results[i].ref].excerpt}</p>
                  </a>
                </div>
              </div>
              \`;
        
              resultsHtml += rowHtml;
            }
          }
        }
      }

      $('#searchResults').html(resultsHtml);
  
      $('#searchForm').submit((event) => {
        event.preventDefault();

        var possiblePort = '';

        if (window.location.port) {
          possiblePort = ':' + window.location.port;
        }

        window.location.href = window.location.protocol + '//' + window.location.hostname + possiblePort + "/docs/search?query=" + encodeURI($('#searchInput').val());
      });
    });
    `;

    const filePath = path.join(__dirname, '..', 'build', 'js', 'docs-search.js');

    files['js/docs-search.js'] = {};
    files['js/docs-search.js'].contents = fileContents;

    done();
  };
};

module.exports = metalsmithMoonsearch;