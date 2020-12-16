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

  var query = `WITH user_bookshelf AS(
    SELECT ISBN 
    FROM Bookshelf
    WHERE username = "${username}"
    ),
    overlap AS(
    SELECT b.username, count(b.ISBN) as cnt
    FROM Bookshelf b LEFT JOIN user_bookshelf ub ON b.ISBN = ub.ISBN
    WHERE ub.ISBN IS NOT NULL AND b.username <> "${username}"),
    
    similar_user AS(
    SELECT username
    FROM overlap 
    ORDER BY cnt DESC
    LIMIT 10),
    
    rec_book AS(
    SELECT b.ISBN
    FROM Bookshelf b JOIN similar_user s ON b.username = s.username LEFT JOIN user_bookshelf ub ON b.ISBN = ub.ISBN
    WHERE ub.ISBN IS NULL)
    
    SELECT b.ISBN AS ISBN, b.title, b.author, b.image_url_l
    FROM Books b JOIN rec_book r ON b.ISBN = r.ISBN`
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
    SELECT b.ISBN AS ISBN, b.title, b.author, b.image_url_l, Round(r.rating,2) AS rating
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
}

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
}

function getSearch(req, res) {
  var inputBook = req.params.bookName; 
  var query = `
    SELECT ISBN, title, author, publisher, image_url_l
    FROM Books 
    WHERE title LIKE '%`+ inputBook + `%' 
    UNION ALL
    SELECT ISBN, title, author, publisher, image_url_l
    FROM Books 
    WHERE author LIKE '%`+ inputBook + `%' 
    UNION ALL 
    SELECT ISBN, title, author, publisher, image_url_l
    FROM Books 
    WHERE publisher LIKE '%`+ inputBook + `%' 
    LIMIT 20;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });   
}

function getBookbyISBN(req, res) {
  var inputISBN = req.params.ISBN;
  var query = `
    SELECT title, author, publisher, year, image_url_l
    FROM Books 
    WHERE ISBN =  '${inputISBN}';
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });   
}

function getAvgRating(req, res) {
  var inputISBN = req.params.ISBN;
  var query = `
  WITH avgRatings AS (
    SELECT DISTINCT ISBN, AVG(rating) AS avgRating
    FROM Ratings
    GROUP BY ISBN
  )
  SELECT avgRating
  FROM avgRatings
  WHERE ISBN = "${inputISBN}";
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });   
}

function getUserRating(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var query = `
  SELECT rating
  FROM Ratings
  WHERE username = "${username}" AND ISBN = "${ISBN}";
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });   
}

function submitRating(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var rating = req.params.rating;

  var query = `
  INSERT INTO Ratings (ISBN, rating, username)
  VALUES ("${ISBN}",${rating},"${username}");
  `
  connection.query(query, function(err, rows, fields){
    if (err) {
      //will return err if username-ISBN already exists in db
      console.log(err);
    } else {
      //row is an array of dict, each dict is a tuple in talbe
      res.json({status: "success"});
    }
  });
}

function updateRating(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var rating = req.params.rating;
  var query = `
  UPDATE Ratings 
  SET rating = ${rating}
  WHERE username = "${username}" AND ISBN = "${ISBN}";
  `
  connection.query(query, function(err, rows, fields){
    if (err) {
      //will return err if username-ISBN already exists in db
      console.log(err);
    } else {
      res.json({status: "success"});
    }
  });
}

function getRelatedBooks(req, res) {
  var ISBN = req.params.ISBN;
  var query = `
  WITH curAuthor AS(
    SELECT author
    FROM Books
    WHERE ISBN = "${ISBN}"
   )
   SELECT b.ISBN AS ISBN, b.title AS title, b.image_url_l AS image_url_l
   FROM Books b JOIN curAuthor a ON b.author = a.author
   WHERE b.ISBN <> "${ISBN}"
  `
  connection.query(query, function(err, rows, fields){
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });  
}

function getBookshelf(req, res) {
  var username = req.query.username;
  var query = `
    SELECT b.ISBN as ISBN, b.title, b.author, b.image_url_l
    FROM Bookshelf bs JOIN Books b ON bs.ISBN = b.ISBN
    WHERE bs.username = '${username}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  }); 
}

function getBookOnShelf(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var query = `
  SELECT *
  FROM Bookshelf
  WHERE username = "${username}" AND ISBN = "${ISBN}";
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //rows: is an empty array if db retrieves nothing
      // is an array of dicts if db retrieves tuples.
      res.json(rows);
    }
  });  
}
function addBook(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var query = `
  INSERT INTO Bookshelf (ISBN, username)
  VALUES ("${ISBN}", "${username}");
  `
  connection.query(query, function(err, rows, fields){
    if (err) {
      console.log(err);
    } else {
      res.json({status: "success"});
    }
  });
}

function removeBook(req, res) {
  var username = req.params.username;
  var ISBN = req.params.ISBN;
  var query = `
  DELETE
  FROM Bookshelf
  WHERE username = "${username}" AND ISBN = "${ISBN}";
  `
  connection.query(query, function(err, rows, fields){
    if (err) {
      console.log(err);
    } else {
      res.json({status: "success"});
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  signup:signup,
  login: login,
  getRecs:getRecs,
  addAccount:addAccount,

  getTop10: getTop10,
  getTopDecade: getTopDecade,
  getSearch: getSearch,

  getBookbyISBN: getBookbyISBN,
  getAvgRating: getAvgRating,
  getUserRating: getUserRating,
  submitRating: submitRating,
  updateRating: updateRating,
  getRelatedBooks: getRelatedBooks,
  getBookOnShelf: getBookOnShelf,
  addBook: addBook,
  removeBook: removeBook,

  getBookshelf: getBookshelf
}