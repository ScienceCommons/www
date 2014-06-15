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
    loader: "style!css!sass"
  }, {
    test: /\.gif/,
    loader: "url-loader?limit=10000&minetype=image/gif"
  }, {
    test: /\.jpg/,
    loader: "url-loader?limit=10000&minetype=image/jpg"
  }, {
    test: /\.png/,
    loader: "url-loader?limit=10000&minetype=image/png"
  }, {
    test: /\.js$/,
    loader: "msx-loader"
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
        entry: {
          main: "./client/app.js"
        },
        output: {
          path: DEVELOPMENT_PATH+"/assets",
          filename: "[name].js"
        },
        externals: {
          "mithril": "m"
        }
      },
      production: {
        debug: false,
        entry: {
          main: "./client/app.js"
        },
        output: {
          path: PRODUCTION_PATH+"/assets",
          filename: "[name].js"
        },
         externals: {
          "mithril": "m"
        },
        plugins: [
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.DedupePlugin()
        ]
      }
    },
    watch: {
      webpack: {
        files: [
          "./client/**/*.js",
          "./client/**/*.scss"
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
        src: "client/index.html",
        dest: DEVELOPMENT_PATH + "/index.html"
      },
      production: {
        src: "client/index.html",
        dest: PRODUCTION_PATH + "/index.html"
      }
    },
    webfont: {
      icons: {
        src: "client/icons/*.svg",
        dest: "client/fonts",
        destCss: "client",
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
    aws: grunt.file.readJSON('./aws.json'),
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      production: {
        options: { gzip: true },
        upload: [
          {
            src: './build/production/public/index.html',
            dest: 'index.html'
          },
          {
            src: './build/production/public/assets/*',
            dest: 'assets/'
          },
          {
            src: './build/production/public/assets/assets/*',
            dest: 'assets/'
          }
        ]
      }
    },
    clean: {
      development: {
        src: [DEVELOPMENT_PATH+"/assets"]
      },
      production: {
        src: [PRODUCTION_PATH+"/assets"]
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

  grunt.registerTask("build:development", ["clean:development", "env:development", "preprocess:development", "webfont", "webpack:development"]);
  grunt.registerTask("build:production", ["clean:production", "env:production", "preprocess:production", "webfont", "webpack:production"]);
  grunt.registerTask("deploy", ["build:production", "s3:production"]);

  grunt.registerTask("default", []);
};
