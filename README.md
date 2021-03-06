# NYT Sports Scraper

[![Build Status](https://travis-ci.com/EGartland/Group-Project-2.svg?branch=master)](https://travis-ci.com/EGartland/Group-Project-2)

This is a Node.js application that utilizes Cheerio and a MongoDB back-end to scrape and save NYT Sports articles to a Bootstrap UI.

[NYT Sports Scraper](https://mongodbnyt.herokuapp.com/)

## Built With

* [Node.js](https://nodejs.org/en/about/) - Javascript runtime network

* [Heroku](https://www.heroku.com/) - For application deployment

* [NPM](https://www.npmjs.com/) - Dependency Management

* [Bootstrap](http://getbootstrap.com/docs/4.1/getting-started/introduction/) - CSS Framework for Styling

* [Express.js](https://expressjs.com/) - Web framework for Node.js

* [MongoDB](https://www.mongodb.com/what-is-mongodb) - Database Used for Development

* [Axios](https://www.npmjs.com/package/axios) - 'Scraping' method; Promise based HTTP client for the browser and node.js

* [Travis CI](https://docs.travis-ci.com/) - Test and deploy code

## Author

* **Edward Gartland** - [LinkedIn](https://www.linkedin.com/in/edward-gartland/)

## Operation

1) Clone this repository to your local system.

2) Open terminal.

3) Navigate to the appropriate folder, and install all required packages ('mongojs', 'express', 'express-handlebars', 'body-parser', 'express-handlebars', 'cheerio', 'mongoose', 'morgan', 'axios', and 'handlebars'). 

4) Run the command *npm i* to install node modules.

5) Then run node server.js, open your web browser, and navigate to your *localhost*.

6) Or simply navigate to the deployed application on Heroku at https://mongodbnyt.herokuapp.com/.


## Functionality

#### Scrape for Most Recent Articles

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/scrapeArticles.gif)

#### View Saved Articles

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/savedArticles.gif)

#### Leave/View Comments

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/comments.gif)
