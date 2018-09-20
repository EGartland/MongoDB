var db = require("../models");
var ObjectId = require("mongojs").ObjectId;

module.exports = function(app, axios, cheerio) {

    //
    app.get("/", function (req, res) {
        db.Article.find({}).then(function (dbArticles) {
            res.render("index", {numsaved:dbArticles.length});
        });
    });

    // A GET route for scraping the NYT Tech Section
    app.get("/scrape", function(req, res) {
        // Get the body of the targeted web page
        axios.get("https://www.nytimes.com/section/sports/").then(function(response) {
            // load the body to a cheerio object for jQuery like DOM traversing and manipulation
            var $ = cheerio.load(response.data);
        
            // create an array of articles (array of objects representing articles) that need to be saved
            var scrapedArticlesArr = [];
            // Get every h2 tag inside an article tag - this will only get the main articles
            $("#latest-panel article.story.theme-summary").each(function(i, element) {
                var result = {};
              
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(element).find('h2.headline').text().trim();
                result.link = $(element).find('.story-body>.story-link').attr('href');
                result.summary = $(element).find('p.summary').text().trim();
                scrapedArticlesArr.push(result);
              });

            res.render("scraped", {scrapedArticles:scrapedArticlesArr});

            /*
            Leaving the commented out code below for future reference on how to bulk load data to Mongo via Mongoose
            */
            // Create a new the all the articles all at once with the articlesToSaveObj array
            // db.Article.create(scrapedArticlesArr).then(function(dbArticle) {
            //     // Send the number of articles that were saved
            //     res.json({saved:dbArticle.length });
            // }).catch(function(err) {
            //     res.json(err);
            // });            

        });

    });

    // Get all articles in the db
    app.get("/articles", function(req, res) {
        db.Article.find({}).then(function(dbArticles) {
            var hbsObject = {articles:dbArticles}
            res.render("articles", hbsObject);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // Save an Article but prevent duplicates with upsert (and also maintains the Notes ref by manually setting notes to an empty array)
    app.post("/articles", function (req, res) {
        db.Article.findOneAndUpdate(
            { title:req.body.title }, 
            { $set:{ link:req.body.link, notes:[] } }, 
            { upsert:true, new:true },
            function (err, result) {
                res.json(result);
            }
        );
    });

    // Delete an Article and all associated Notes
    app.delete("/articles/:id", function(req, res) {    
        var id = req.params.id

        db.Article.findOne({ _id: id }).populate("notes").then(function (result) {
            //gather up the ids of the notes associated to an article
            var notesIDArr = [];
            for (var i=0; i < result.notes.length; i++) {
                notesIDArr.push(ObjectId(result.notes[i].id));
            }

            //remove all notes associated with the article
            db.Note.remove({_id:{$in:notesIDArr}}).then(function (deleted) {
                db.Article.remove({_id:ObjectId(id)}).then(function(result) {
                    res.json(result);
                });            
            });
        });

    });

    // Retrieve specific Article by id and populate it's note field, then send back the object representing the article to the client side
    app.get("/articles/:id", function(req, res) {
        // find the target article, populate it's note reference field, then return it to the client side
        db.Article.findOne({ _id: req.params.id }).populate("notes").then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });
  
    // Route for saving/updating a Note and associating it to an article
    app.post("/articles/:id", function(req, res) {
        var queryFilter;

        if (req.body.noteID == "") {
            // match update by title - could be a new note, if a note with the same title already exists then it's body is updated.
            queryFilter = { title:req.body['note-title'] };
        } else {
            // match explicitly by id - this is an update an in this case the title itself can be changed.
            queryFilter = {_id:req.body.noteID};
        }
        
        db.Note.findOneAndUpdate(
            queryFilter, 
            { $set:{title: req.body['note-title'], body:req.body['note-body']} }, 
            { upsert:true, new:true }
        ).then(function(dbNote) {

            //get the associated note ids
            db.Article.findOne({_id:req.params.id}).then(function (data) {

                //check to see if the note is already associated, if it is don't push the id to the Articles reference array
                var insertCheck = true;
                for (var i=0; i < data.notes.length; i++) {
                    if (ObjectId(data.notes[0].id).toString() == dbNote._id.toString()) {
                        insertCheck = false;
                    }
                }
                
                if (insertCheck) {
                    db.Article.findOneAndUpdate(
                        { _id: req.params.id }, 
                        { $push:{ notes: dbNote._id } }, 
                        { upsert:true, new:true }
                    ).populate("notes").then(function (dbArticle) {
                        res.json(dbArticle);
                    }).catch(function(err) {
                        res.json(err);
                    });;
                }
            });
        })
    });

    // Delete an Note and it's ref in Articles
    app.delete("/notes/:id", function(req, res) {
        var noteID = ObjectId(req.params.id);

        db.Note.remove({_id:noteID}).then(function (result) {
            db.Article.findOne({_id:ObjectId(req.body.articleID)}).then(function (result) {
                var noteRefs = [];

                //get all the note references and put them on an array that we will mutate
                for (i=0; i < result.notes.length; i++) {
                    noteRefs.push(result.notes[0].toString())
                }

                var x = noteRefs.length
                while (x--) {
                    if (noteRefs[x] == req.params.id) noteRefs.splice(x, 1);
                }                

                //put it back to type ObjectId
                for (i=0; i < noteRefs.length; i++) {
                    noteRefs[i] = ObjectId(noteRefs[i]) ;
                }
                
                db.Article.findOneAndUpdate({_id:ObjectId(req.body.articleID)}, { $set:{notes:noteRefs} })
            });

            res.json(result);
        });
    });
  
} //module exports