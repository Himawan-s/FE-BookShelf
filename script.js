const bookshelf = [];
const RENDER_EVENT = 'render_bookShelf';

//chekc ini buat apa di todo => untuk render dari data, 
document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBooks();
    });
});



function addBooks(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    
    const generateID = generateId();
    const booksObject = generateBooksObject(generateID, bookTitle, author, bookYear, isComplete);
    bookshelf.push(booksObject);

    //check ini apa
    document.dispatchEvent(new Event (RENDER_EVENT));
    //buat functionya
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBooksObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

//untuk merender list dari bookshelf
document.addEventListener(RENDER_EVENT, function(){
    console.log(bookshelf);
})

function makeBooks(booksObject){
    //create judul buku
    const textTitle = document.createElement('h3');
    textTitle.innerText = booksObject.title;

    //create author 
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${booksObject.author}`;
    
    //create tahun 
    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${booksObject.year}`;

    //buat container article
    const textContainer = document.createElement('div');
    textContainer.classList.add('action'); //checl class yang dipake css
    //textContainer.append(textTitle, textAuthor, textYear);
    

    //buat container div 
    const container = document.createElement('article');
    container.classList.add('book_item'); //class item shadow dicek lagi css
    container.setAttribute('id', 'book-${booksObject.id}');
    container.append(textTitle, textAuthor, textYear); //dimasukin text container ->(class) inner
    container.append(textContainer);

    if (!booksObject.isCompleted){ //false
        const selesaiButton = document.createElement('button');
        selesaiButton.classList.add('green');
        selesaiButton.addEventListener('click', function(){
            selesaikanBuku(booksObject.id); //create function nanti
        });
        selesaiButton.innerText='Selesai Dibaca';

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.addEventListener('click', function(){
            deleteBuku(booksObject.id)//create function nanti 
        });
        hapusBuku.innerText='Hapus Buku';

        textContainer.append(selesaiButton, hapusBuku);
    } else {
        const blmSelsaiBaca = document.createElement('button');
        blmSelsaiBaca.classList.add('green');
        blmSelsaiBaca.addEventListener('click', function(){
            undoBuku(booksObject.id);
        });
        blmSelsaiBaca.innerText='Belum Selesai Dibaca';

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.addEventListener('click', function(){
            deleteBuku(booksObject.id)//create function nanti 
        });
        hapusBuku.innerText='Hapus Buku';

        textContainer.append(blmSelsaiBaca, hapusBuku);
    }
    
    return container;
}

//start routing button
function selesaikanBuku(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBuku(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    bookshelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBuku(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function findBook(bookId){
    for (const bookItem of bookshelf){
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for (const index in bookshelf){
        if (bookshelf[index].id === bookId){
            return index;
        }
    }

    return -1;
}

document.addEventListener(RENDER_EVENT, function() {
    const incompletedBook = document.getElementById('incompleteBookshelfList');
    incompletedBook.innerHTML = '';

    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';

    for (const books of bookshelf){
        const bookElement = makeBooks(books);
        if (!books.isCompleted) { 
            incompletedBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function isStorageExist(){
    if (typeof (Storage) === undefined){
        alert('browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function (){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null){
        for (const books of data){
            bookshelf.push(books);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function(){
    if (isStorageExist()){
        loadDataFromStorage();
    }
});