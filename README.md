NG-Mongo, an AngularJS-powered MongoDB Explorer from Tekpub
=====

This is a MongoDB Explorer written in AngularJS using Twitter Bootstrap, powered by NodeJS/Express (for the API part). This is part of [Tekpub's AngularJS.series](http://tekpub.com/productions/angular)

Currently NG-Mongo will:

 - Browse local MongoDB databases, collections, and documents
 - Allow you to edit each document using the excellent Ace Text Editor

### Requirements
NG-Mongo is written in Javascript (not CoffeeScript) on top of AngularJS and, of course, requires MongoDB. The project itself was created in JetBrains WebStorm but if you're a Microsoft developer you can download this directly and open it in WebMatrix 2 or 3.

The web server is NodeJS, [so you'll want to have Node installed as well](http://nodejs.org). If you receive errors on first start, run `npm install` in the root of the site (from the command line) to install any modules that don't get loaded from the repo.

### Installation
Clone this repo: `git clone https://github.com/tekpub/ng-mongo.git` into any directory and make sure that MongoDB and Node are installed on your machine. If you're using WebMatrix you can hit "Run" and up it will go.

On Mac/Linux, change directories into ng-mongo and "npm start" to start up the web server. If you receive any errors on start, be sure to make sure that all modules are installed using `npm install -d`
