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
app.post('/addAccount', routes.addAccount)


app.get('/top10', routes.getTop10);
app.get('/topDecade', routes.getTopDecade);
app.get('/:bookName', routes.getSearch);








app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});