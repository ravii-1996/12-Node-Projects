const express = require('express');
const bodyparser = require('body-parser');
const unirest = require('unirest');

var app = express();

// API Details 
API_URL="https://www.googleapis.com/books/v1/volumes?q=java"

const Books = require('./model/BookSchema');

// Using EJS to render the view
app.set('view-engine', 'ejs');

// bodyparser to expose the req body
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// we are using unirest here to fetch book data through google api.
// pass api key in header for authorization.
unirest.get(API_URL)
  .header("Api-key", process.env.API_KEY)
  .end(function (result) {
    /**
     * after getting the result save into the DB
     * We are using scheduler method that delete and insert db data when we restart the server..
     * This scheduler method is temporary. We cant use this type of termnilogy in production  env.
     */
    Books.scheduler(result.body.items, function (err, result) {
      if (err)
        throw err;
      console.log("Scheduler Executed...");
    });
  });

// render home page
app.get("/", function(req,res){
  res.render('home.ejs');
})

/**
 * Find book from DB if data is present..
 * We can use JWT Middleware if we want that only authorized user can see this details.
 * Here we fecth the book details from DB if it is present.
 */
app.get('/findBook', async function (req, res) {
  // Get the title from url.. pass into the function which is defined in model.
   Books.findBook(req.query.title, function(err, result){
    if(err)
      throw err;
    res.render('output.ejs', {
      book: result[0]
    });
  });
});

// Start Application
app.listen(3200, function(err, result){
  if(err)
    throw err;
    console.log("Server is running at 3200");
});