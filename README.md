Getting started
===============

Install [node](http://nodejs.org/download/).

Ensure that you have grunt and grunt cli installed globally

```
    sudo npm install -g grunt grunt-cli
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
```
and then run the grunt task, e.g.:
```
grunt deploy:production
```
