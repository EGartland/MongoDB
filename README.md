# MongoScraper

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

   "axios": "^0.17.0",
    "body-parser": "^1.18.2",
    "cheerio": "^1.0.0-rc.2",
    "express": "^4.16.2",
    "express-handlebars": "^3.0.0",
    "handlebars": "^4.0.11",
    "mocha": "^5.2.0",
    "mongojs": "^2.4.1",
    "mongoose": "^4.12.4",
    "morgan": "^1.9.0"

4) Run the command *npm i* to install node modules.

5) Then run node server.js, open your web browser, and navigate to your *localhost*.

6) Or simply navigate to the deployed application on Heroku at https://mongodbnyt.herokuapp.com/.


## Functionality

#### Scrape for Most Recent Articles

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/CreateEmployee.gif)

#### View Saves Articles

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/PlaceOrder.gif)

#### Leave/View Comments

![Output Sample](https://github.com/EGartland/mongoDB/blob/master/public/img/Courier.gif)
