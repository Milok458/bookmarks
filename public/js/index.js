const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function addToResults(url, settings) {
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            responseJSON.forEach(book =>{
                results.innerHTML += `<li class="listItem"> <p>${book.id}</p> <p>${book.title}</p> <p>${book.description}</p>
                                      <p>${book.url}</p> <p>${book.rating}</p> </li>`;
            });
        })
        .catch( err => {
            alert(err.message);
        });
}

function regularQuery(url, settings){
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response;
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            alert("Action Successful!");
        })
        .catch( err => {
            alert(err.message);
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${TOKEN}`
        }
    };

    addToResults(url, settings);
}

function fetchByTitle(title){

    let url = '/bookmark?title='+title;
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${TOKEN}`
        }
    };

    addToResults(url, settings);
}

function deleteBook(id) {
    let url = '/bookmark/'+id;
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${TOKEN}`
        }
    };

    regularQuery(url, settings);
}

function addBook(body){
    let url = '/bookmarks';
    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    };

    regularQuery(url, settings);
}

function updateBook(id, body){
    let url = '/bookmark/'+id;
    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    };

    regularQuery(url, settings);
}

function watchAddForm() {
    let form = document.querySelector( '.add-form' );

    form.addEventListener('submit' , (event) => {
        event.preventDefault();
        let title = document.getElementById( 'bookTitleAdd' ).value;
        let desc = document.getElementById( 'bookDescriptionAdd' ).value;
        let url = document.getElementById( 'bookUrlAdd' ).value;
        let rating = document.getElementById( 'bookRatingAdd' ).value;

        if(Number(rating)){
            let body = {
                title: title,
                description: desc,
                url: url,
                rating: Number(rating)
            };

            addBook(body);

            fetchBookmarks();
        }
        else{
            alert('Rating must be a numeric value!');
        }

    });
}

function watchUpdateForm() {
    let form = document.querySelector( '.update-form' );

    form.addEventListener('submit' , (event) => {
        event.preventDefault();
        let id = document.getElementById( 'bookIdUp' ).value;
        let title = document.getElementById( 'bookTitleUp' ).value;
        let desc = document.getElementById( 'bookDescriptionUp' ).value;
        let url = document.getElementById( 'bookUrlUp' ).value;
        let rating = document.getElementById( 'bookRatingUp' ).value;

        let body = {
            id: id
        };

        if(title !== ""){
            body.title = title;
        }

        if(desc !== ""){
            body.description = desc;
        }

        if(url !== ""){
            body.url = url;
        }

        if(rating !== ""){
            if(Number(rating)){
                body.rating = Number(rating);
            }
            else{
                alert('Rating must be a numeric value!');
            }
        }

        console.log(body);

        updateBook(id, body);

        fetchBookmarks();
    });
}

function watchDeleteForm() {
    let form = document.querySelector( '.delete-form' );

    form.addEventListener('submit' , (event) => {
        event.preventDefault();
        let id = document.getElementById( 'bookIdDel' ).value;

        deleteBook(id);

        fetchBookmarks();
    });
}

function watchGetForm() {
    let form = document.querySelector( '.get-form' );

    form.addEventListener('submit' , (event) => {
        event.preventDefault();
        let title = document.getElementById( 'bookTitleSrch' ).value;

        fetchByTitle(title);
    });
}

function watchGetAllForm() {
    let form = document.querySelector( '.get-all-form' );

    form.addEventListener('submit' , (event) => {
        event.preventDefault();

        fetchBookmarks();
    });
}

function init() {
    fetchBookmarks();
    watchAddForm();
    watchDeleteForm();
    watchGetAllForm();
    watchUpdateForm();
    watchGetForm();
}

init();