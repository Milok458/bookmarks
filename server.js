const express = require( 'express' );
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const keyChecker = require('./middleware/keyChecker');
const {Bookmarks} = require('./models/bookmarkModel');
const {DATABASE_URL, PORT} = require( './config' );

const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(keyChecker);

let listOfBookmarks = [
    {
        id : uuid.v4(),
        title : "The Book Thieve",
        description : "The story of Lisel Meminger",
        url : "https://www.amazon.com/Book-Thief-Markus-Zusak/dp/0375842209",
        rating : 10
    },
    {
        id : uuid.v4(),
        title : "Harry Potter And The Sorcerer's Stone",
        description : "First book in the Harry Potter series",
        url : "https://www.amazon.com/Harry-Potter-Sorcerers-Stone-Rowling/dp/0590353403/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1587872842&sr=1-1",
        rating : 10
    },
    {
        id : uuid.v4(),
        title : "The Last Wish: Introducing the Witcher",
        description : "Fist book in the Witcher series",
        url : "https://www.amazon.com/Book-Thief-Markus-Zusak/dp/0375842209",
        rating : 10
    }
];

app.get('/bookmarks', (req, res) => {
    Bookmarks
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });
});

app.get('/bookmark', (req, res) => {
    let title = req.query.title;

    if(!title){
        res.statusMessage = "No title was sent as parameter!";
        return res.status(406).end();
    }

    Bookmarks
        .getBookmarksByTitle(title)
        .then(result => {
            if(result.length === 0){
                res.statusMessage = "No title was found with parameter!";
                return res.status(404).end();
            }
            else return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });
});

app.post('/bookmarks', jsonParser, ( req, res ) => {
    console.log( "Body ", req.body );

    let title = req.body.title;
    let desc = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!title || !desc || !url || !rating){
        res.statusMessage = "One of these parameters is missing in the request!";
        return res.status(406).end();
    }

    if(typeof(rating) !== 'number'){
        res.statusMessage = "The 'rating' MUST be a number!";
        return res.status(409).end();
    }

    let newBook = {
        id : uuid.v4(),
        title : title,
        description : desc,
        url : url,
        rating : rating
    };

    Bookmarks
        .createBookmark(newBook)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });
});

app.delete('/bookmark/:id', ( req, res ) => {

    let id = req.params.id;

    Bookmarks
        .removeBookmark(id)
        .then(result => {
            if(result.deletedCount === 0){
                res.statusMessage = "That 'id' was not found in the list of bookmarks.";
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });
});

app.patch('/bookmark/:id', jsonParser, ( req, res ) => {
    let id = req.params.id;
    let idB = req.body.id;

    if(!idB){
        res.statusMessage = "The 'id' was not found in the body!";
        return res.status(406).end();
    }

    if(id !== idB){
        res.statusMessage = "The 'id'sent in parameters and the 'id' sent in body do not match!";
        return res.status(409).end();
    }

    Bookmarks
        .updateBookmark(id, req.body)
        .then(result => {
            if(result.n === 0){
                res.statusMessage = "That 'id' was not found in the list of bookmarks.";
                return res.status(404).end();
            }
            return res.status(202).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });
});

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
        .catch( err => {
            console.log( err );
        });
});

