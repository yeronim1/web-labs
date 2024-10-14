class Book {
    constructor(title, author, pages, description, price) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.description = description;
        this.price = price;
    }
}

let books = JSON.parse(localStorage.getItem('books')) || [];
let filteredBooks = [...books];

document.getElementById('book-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    let pages = document.getElementById('pages').value;
    const description = document.getElementById('description').value;
    let price = document.getElementById('price').value;

    pages = pages.startsWith('-') ? pages.slice(1) : pages;
    price = price.startsWith('-') ? price.slice(1) : price;

    const book = new Book(title, author, parseInt(pages), description, parseFloat(price));
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    window.location.href = 'books.html';
});

document.getElementById('edit-book-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    let pages = document.getElementById('pages').value;
    const description = document.getElementById('description').value;
    let price = document.getElementById('price').value;

    pages = pages.startsWith('-') ? pages.slice(1) : pages;
    price = price.startsWith('-') ? price.slice(1) : price;

    books[bookId] = {
        title: title,
        author: author,
        pages: parseInt(pages),
        description: description,
        price: parseFloat(price)
    };

    localStorage.setItem('books', JSON.stringify(books));
    window.location.href = 'books.html';
});

function renderBooks(bookArray = books) {
    const bookList = document.getElementById('book-list');
    if (bookList) {
        bookList.innerHTML = '';
        bookArray.forEach((book, index) => {
            bookList.innerHTML += `
                <div class="book">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Pages: ${book.pages}</p>
                    <p>Description: ${book.description || 'No description available'}</p>
                    <p>Price: ${book.price} UAH</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editBook(${index}, '${book.title}')">Edit</button>
                        <button class="remove-btn" onclick="removeBook(${index})">Remove</button>
                    </div>
                </div>
            `;
        });
    }
}

function removeBook(index) {
    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    filteredBooks = [...books];
    renderBooks(filteredBooks);
}

function sortBooksByPrice() {
    filteredBooks.sort((a, b) => b.price - a.price);
    renderBooks(filteredBooks);
}

function totalBooksPrice() {
    const total = filteredBooks.reduce((sum, book) => sum + parseFloat(book.price), 0);
    document.getElementById('total-expenses').innerText = total.toFixed(2);
}

function editBook(index, title) {
    const bookIndex = books.findIndex(book => book.title === title);
    if (bookIndex !== -1) {
        window.location.href = `edit.html?id=${bookIndex}`;
    }
}

function searchBooks() {
    const query = document.getElementById('searchQuery').value.trim().toLowerCase();
    filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    renderBooks(filteredBooks);
}

function clearSearch() {
    document.getElementById('searchQuery').value = '';
    filteredBooks = [...books];
    renderBooks(filteredBooks);
}

document.getElementById('searchBtn')?.addEventListener('click', function () {
    searchBooks();
});

document.getElementById('clearBtn')?.addEventListener('click', function () {
    clearSearch();
});

renderBooks();
