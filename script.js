const bookshelf = [];
const RENDER_EVENT = 'render_bookShelf';

//chekc ini buat apa di todo
document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById()
})

function addBooks(){
    const bookTitle = document.getElementById('inputBookTitle');
    const author = document.getElementById('inputBook Author');
    const bookYear = document.getElementById('inputBookYear');

    const generateID = generateID();
    const booksObject = generateBooksObject(generateID, bookTitle, author, bookYear, false);
    bookshelf.push(booksObject);

    //check ini apa
    document.dispatchEvent(new Event (RENDER_EVENT));
    //buat functionya
    saveData();
}

function generateID(){
    return+new Date();
}

function generateBooksObject(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
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
    const textContainer = document.createElement('article');
    textContainer.classList.add('book','item'); //checl class yang dipake css
    textContainer.append(textTitle, textAuthor, textYear);

    //buat container div 
    const container = document.createElement('div');
    container.classList('action'); //class item shadow dicek lagi css
    container.append(textContainer); //dimasukin text container ->(class) inner
    container.setAttribute('id', 'book-${booksObject.id}');

    if (booksObject.isComplete){ //false
        const selesaiButton = document.createElement('button');
        selesaiButton.classList.add('green');

        selesaiButton.addEventListener('click', function(){
            selesaikanBuku(booksObject.id); //create function nanti
        });

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');

        hapusBuku.addEventListener('click', function(){
            hapuskanBuku(booksObject.id)//create function nanti 
        });

        container.append(selesaiButton, hapusBuku);
    } else {
        
    }


}