# CurateScience Client

This repository is the frontend/client for the [CurateScience](https://www.curatescience.org/) application. It's a single-page Javascript app written in the [Mithril Framework](https://lhorie.github.io/mithril/). It uses [Grunt](http://gruntjs.com/) for task running and [webpack](http://webpack.github.io/) to build the app for deployment. 

## Contributing

Please see the CurateScience [contributing guidelines](https://github.com/ScienceCommons/api/blob/master/CONTRIBUTING.md) and set aside an hour or two to study [Mithril](https://lhorie.github.io/mithril/) if you've never worked with it before.

## Getting started


Install [node](http://nodejs.org/download/).

Ensure that you have grunt and grunt cli installed globally

```
    sudo npm install -g grunt grunt-cli
```

Set your DEV_API_ROOT environment variable to the CurateScience API server you want to query (trailing slash required), e.g.:

```
    export DEV_API_ROOT="http://localhost:5000/"
```

Then

```
    npm install
    grunt serve
```

In order to compile the icons you will need [fontforge](http://fontforge.github.io/en-US/) installed.

The Gruntfile is set up with tasks to compile and deploy the assets to an Amazon Web Services S3 account. In order to deploy to your S3 account you will need to set the environment variables:
```
    AWS_S3_KEY
    AWS_S3_SECRET
    AWS_S3_TEST_BUCKET
    AWS_S3_BUCKET
    PROD_API_ROOT
```
and then run the grunt task, e.g.:
```
grunt deploy:production
```
