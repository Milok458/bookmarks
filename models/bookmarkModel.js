const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
});

const bookmarkCollection = mongoose.model('bookmarks', bookmarkSchema);

const Bookmarks = {
    createBookmark: function(newBookmark){
        return bookmarkCollection
            .create(newBookmark)
            .then(createdBookmark => {
                return createdBookmark;
            })
            .catch( err => {
                return err;
            });
    },
    getAllBookmarks: function(){
        return bookmarkCollection
            .find()
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    },
    getBookmarksByTitle: function(titleFind){
        return bookmarkCollection
            .find({title: titleFind})
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    },
    updateBookmark: function(idFind, changes){
        return bookmarkCollection
            .update({id: idFind}, {$set:changes})
            .then(updatedBookmark => {
                return updatedBookmark;
            })
            .catch( err => {
                return err;
            });
    },
    removeBookmark: function(idFind){
        return bookmarkCollection
            .remove({id: idFind})
            .then(removedBookmark => {
                return removedBookmark;
            })
            .catch( err => {
                return err;
            });
    }
};

module.exports = { Bookmarks };