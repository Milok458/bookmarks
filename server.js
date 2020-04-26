const express = require( 'express' );
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const uuid = require('uuid');
const keyChecker = require('./middleware/keyChecker');

const app = express();

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

app.get('/api/bookmarks', (req, res) => {
    return res.status(200).json(listOfBookmarks);
});

app.get('/api/bookmark', (req, res) => {
    let title = req.query.title;

    if(!title){
        res.statusMessage = "No title was sent as parameter!";
        return res.status(406).end();
    }

    let result = [];

    listOfBookmarks.forEach(book => {
       if(book.title === title) result.push(book);
    });

    if(result.length === 0){
        res.statusMessage = "No title was found with parameter!";
        return res.status(404).end();
    }

    return res.status(200).json(result);
});

app.post('/api/bookmarks', jsonParser, ( req, res ) => {
    let title = req.body.title;
    let desc = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!title || !desc || !url || !rating){
        res.statusMessage = "One of these parameters is missing in the request!";
        return res.status(406).end();
    }

    if(typeof(id) !== 'number'){
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

    listOfBookmarks.push(newBook);

    return res.status(201).json(newBook);
});

app.delete('/api/bookmark/:id', ( req, res ) => {

    let id = req.params.id;

    let itemToRemove = listOfBookmarks.findIndex( (book) => {
        if(book.id === id){
            return true;
        }
    });

    if(itemToRemove < 0){
        res.statusMessage = "That 'id' was not found in the list of bookmarks.";
        return res.status(404).end();
    }

    listOfBookmarks.splice( itemToRemove, 1 );
    return res.status(200).end();
});

app.patch('/api/bookmark/:id', jsonParser, ( req, res ) => {
    let id = req.params.id;
    let idB = req.body.id;
    let title = req.body.title;
    let desc = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!idB){
        res.statusMessage = "The 'id' was not found in the body!";
        return res.status(406).end();
    }

    if(id !== idB){
        res.statusMessage = "The 'id'sent in parameters and the 'id' sent in body do not match!";
        return res.status(409).end();
    }

    let updateBook = listOfBookmarks.find((book) => {
        if(book.id === id){
            return book;
        }
    });

    if(!title) updateBook.title = title;
    if(!desc) updateBook.description = desc;
    if(!url) updateBook.url = url;
    if(!rating) updateBook.rating = rating;

    return res.status(202).json(updateBook);
});

app.listen(8080, () =>{
    console.log("This server is running on port 8080")
});

