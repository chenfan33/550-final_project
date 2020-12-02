var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

function login(req, res) {
  var username = req.query.username;
  var password = req.query.password;
  console.log(username, password);
  var query = `
    SELECT username, password
    FROM Users
    WHERE username = "${username}"
    AND password = "${password}";
  `
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function signup(req, res) {
  var username = req.query.username;
  var query = `
    SELECT username
    FROM Users
    WHERE username = "${username}"
  `
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}
function getRecs(req,res){
  var username = req.query.username;

  var query = `WITH overlap AS(
SELECT username, count(ISBN) as cnt
FROM Bookshelf
WHERE ISBN IN(
SELECT ISBN 
FROM Bookshelf
WHERE username = "${username}")
AND username <> "${username}"
GROUP BY username),

similar_user AS(
SELECT username
FROM overlap 
ORDER BY cnt DESC
LIMIT 10),

rec_book AS(
SELECT b.ISBN,b.username
FROM Bookshelf b JOIN similar_user s ON b.username = s.username
WHERE b.ISBN NOT IN(
SELECT ISBN 
FROM Bookshelf 
WHERE username = "${username}"))

SELECT  b.title, b.author, b.image_url_l
FROM Books b JOIN rec_book r ON b.ISBN = r.ISBN;`
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });


}
function addAccount(req, res){
  var username = req.query.username;
  var password = req.query.password;
  var email = "default"
  var query = `
        INSERT INTO Users(username,email, password)
        VALUES("${username}",email,"${password}")
  `
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log('Add Success');
    }
  });
}

function getTop10(req, res) {
  var query = `
  WITH bookRating As (
    SELECT DISTINCT ISBN, AVG(rating) AS rating, Count(*)
    FROM Ratings
    GROUP BY ISBN
    Having Count(*)>10
    )
    SELECT b.title, b.author, b.image_url_l, Round(r.rating,2) AS rating
    FROM Books b JOIN bookRating r ON b.ISBN = r.ISBN
    ORDER BY r.rating DESC
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });  
};

function getTopDecade(req, res) {
  var query = `
  WITH ISBN_rating AS (
    SELECT DISTINCT ISBN, AVG(rating) AS rating, Count(rating)
    FROM Ratings
    GROUP BY ISBN
    Having Count(rating) > 10
    )
    , book_rating As (
    SELECT b.ISBN, b.title, b.author, b.image_url_l, b.decade, r.rating 
    FROM Books b JOIN ISBN_rating r ON b.ISBN = r.ISBN )
    , two_from_group As (
    SELECT *, row_number() OVER (
                           PARTITION BY decade 
                           ORDER BY rating DESC
            ) AS row_num
    FROM book_rating
    )
    SELECT ISBN, title, author, image_url_l, decade, Round(rating,2) As rating
    FROM two_from_group
    WHERE row_num >= 1 AND row_num <=3
    ORDER BY decade DESC, rating DESC;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });  
};

function getSearch(req, res) {
  var inputBook = req.params.bookName; 
  console.log(inputBook);
  var query = `
    SELECT title, author, publisher, image_url_l
    FROM Books 
    WHERE title =  '${inputBook}' OR author = '${inputBook}' OR publisher = '${inputBook}' 

    LIMIT 20;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });   
};


// The exported functions, which can be accessed in index.js.
module.exports = {
  getTop10: getTop10,
  getTopDecade: getTopDecade,
  getSearch: getSearch,
  signup:signup,
  login: login,
  getRecs:getRecs,
  addAccount:addAccount
}