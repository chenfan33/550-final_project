const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */



/* ---- (Dashboard) ---- */
// Sign In
app.get('/login', routes.login);
app.get('/signup', routes.signup);
app.get('/recommendations', routes.getRecs);
app.get('/bookshelf', routes.getBookshelf);
app.post('/addAccount', routes.addAccount);


app.get('/top10', routes.getTop10);
app.get('/topDecade', routes.getTopDecade);
app.get('/:bookName', routes.getSearch);

app.get('/book/:ISBN', routes.getBookbyISBN);
app.get('/avgRating/:ISBN', routes.getAvgRating);
app.get('/userRating/:username/:ISBN', routes.getUserRating);
app.get('/submitRating/:username/:ISBN/:rating', routes.submitRating);
app.get('/updateRating/:username/:ISBN/:rating', routes.updateRating);
app.get('/relatedBooks/:ISBN', routes.getRelatedBooks);   		//get book of same author
app.get('/bookOnShelf/:username/:ISBN', routes.getBookOnShelf); //get book from the shelf
app.get('/addBook/:username/:ISBN', routes.addBook);	 		//add book to bookshelf
app.get('/removeBook/:username/:ISBN', routes.removeBook);		//remove book from bookshelf
//use query string (?key1=val1&key2=val2) here will cause problem 



app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});