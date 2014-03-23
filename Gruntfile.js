"use strict";

var LIVERELOAD_PORT = 35729;
var lrSnippet = require("connect-livereload")({
  port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
  return connect.static(require("path").resolve(dir));
};

var webpack = require("webpack");
var fs = require("fs");

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require("load-grunt-tasks")(grunt);
  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON("package.json");
  var jshintConfig = grunt.file.readJSON(".jshintrc");

  var loaders = [{
    test: /\.css$/,
    loader: "style-loader!css-loader"
  }, {
    test: /\.s[ac]ss$/,
    loader: "style!sass-loader"
  }, {
    test: /\.gif/,
    loader: "url-loader?prefix=/assets/&limit=10000&minetype=image/gif"
  }, {
    test: /\.jpg/,
    loader: "url-loader?prefix=/assets/&limit=10000&minetype=image/jpg"
  }, {
    test: /\.png/,
    loader: "url-loader?prefix=/assets/&limit=10000&minetype=image/png"
  }, {
    test: /\.js$/,
    loader: "jsx-loader"
  }, {
    test: /\.woff$/,
    loader: "url-loader?prefix=/assets/&limit=10000&minetype=application/font-woff"
  }, {
    test: /\.ttf$/,
    loader: "file-loader?prefix=/assets/"
  }, {
    test: /\.eot$/,
    loader: "file-loader?prefix=/assets/"
  }, {
    test: /\.svg$/,
    loader: "file-loader?prefix=/assets/"
  }];

  var handle404 = function(src) {
    return function(req, res) {
      var file = src + "/index.html";
      if (grunt.file.exists(file)) {
        return fs.createReadStream(file).pipe(res);
      }
      res.statusCode(404); // where's index.html?
      res.end();
    };
  };

  var DEVELOPMENT_PATH = "build/development";
  var PRODUCTION_PATH = "build/production/public";

  grunt.initConfig({
    pkg: pkgConfig,
    env: {
      development: {
        NODE_ENV: "development"
      },
      production: {
        NODE_ENV: "production"
      }
    },
    webpack: {
      options: {
        entry: "./src/scripts/app.js",
        cache: true,
        stats: {
          colors: true,
          reasons: true
        },
        jshint: grunt.util._.merge(jshintConfig, {
          emitErrors: false,
          failOnHint: false
        }),
        module: {
          preLoaders: [{
            test: '\\.js$',
            exclude: 'node_modules',
            loader: 'jshint'
          }],
          loaders: loaders
        }
      },
      development: {
        debug: true,
        output: {
          path: DEVELOPMENT_PATH,
          filename: "assets/main.js"
        }
      },
      production: {
        debug: false,
        output: {
          path: PRODUCTION_PATH,
          filename: "assets/main.js"
        },
        externals: {
          "react": "React",
          "react/addons": "React",
          "underscore": "_",
          "react-router-component": "ReactRouter"
        },
        plugins: [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      }
    },
    watch: {
      webpack: {
        files: [
          "./src/scripts/{,*/}*.js",
          "./src/styles/{,*/}*.[sac]*ss"
        ],
        tasks: ["webpack:development"]
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          DEVELOPMENT_PATH + "/{,*/}*.html",
          DEVELOPMENT_PATH + "/assets/main.js"
        ]
      }
    },
    connect: {
      options: {
        port: 8000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: "localhost"
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            return [
              lrSnippet,
              mountFolder(connect, DEVELOPMENT_PATH +"/assets"),
              mountFolder(connect, DEVELOPMENT_PATH),
              handle404(DEVELOPMENT_PATH)
            ];
          }
        }
      },
      production: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, PRODUCTION_PATH),
              handle404(PRODUCTION_PATH)
            ];
          }
        }
      }
    },
    preprocess: {
      development: {
        src: "src/index.html",
        dest: DEVELOPMENT_PATH + "/index.html"
      },
      production: {
        src: "src/index.html",
        dest: PRODUCTION_PATH + "/index.html"
      }
    },
    webfont: {
      icons: {
        src: "src/icons/*.svg",
        dest: "src/fonts",
        destCss: "src/styles",
        options: {
          hashes: false,
          htmlDemo: false
        }
      }
    },
    open: {
      server: {
        url: "http://localhost:<%= connect.options.port %>"
      }
    },
    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    }
  });

  grunt.registerTask("serve", function (target) {
    if (target === "production") {
      return grunt.task.run(["build:production", "open", "connect:production:keepalive"]);
    }

    grunt.task.run([
      "connect:livereload",
      "build:development",
      "open",
      "watch"
    ]);
  });

  grunt.registerTask("test", ["karma"]);

  grunt.registerTask("build:development", ["env:development", "preprocess:development", "webfont", "webpack:development"]);
  grunt.registerTask("build:production", ["env:production", "preprocess:production", "webfont", "webpack:production"]);

  grunt.registerTask("default", []);
};
