const apiUrl = '/api/books';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('book-list')) {
        renderBooks();
    }

    // Слухач для форми створення нової книги
    document.getElementById('book-form')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const pages = parseInt(document.getElementById('pages').value.trim(), 10);
        const price = parseFloat(document.getElementById('price').value.trim());

        // Перевіряємо, чи значення позитивні
        if (pages < 0 || price < 0) {
            alert('Кількість сторінок та ціна мають бути позитивними числами.');
            return;
        }


        const newBook = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            pages: document.getElementById('pages').value.trim(),
            description: document.getElementById('description').value.trim(),
            price: document.getElementById('price').value.trim(),
        };
        createBook(newBook);
    });

    // Якщо на сторінці редагування, завантажити дані книги
    const bookId = new URLSearchParams(window.location.search).get('id');
    if (bookId) {
        loadBookForEdit(bookId);
    }

    // Слухач для форми редагування книги
    document.getElementById('edit-book-form')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const pages = parseInt(document.getElementById('pages').value.trim(), 10);
        const price = parseFloat(document.getElementById('price').value.trim());

        // Перевіряємо, чи значення позитивні
        if (pages < 0 || price < 0) {
            alert('Кількість сторінок та ціна мають бути позитивними числами.');
            return;
        }

        const updatedBook = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            pages: document.getElementById('pages').value.trim(),
            description: document.getElementById('description').value.trim(),
            price: document.getElementById('price').value.trim(),
        };
        updateBook(bookId, updatedBook);
    });

    // Слухач для поля пошуку
    const searchElement = document.getElementById('search');
    if (searchElement) {
        searchElement.addEventListener('input', () => {
            renderBooks();
        });
    }

    // Слухач для сортування
    const sortElement = document.getElementById('sort');
    if (sortElement) {
        sortElement.addEventListener('change', () => {
            renderBooks();
        });
    }
});

// Функція для відображення книг
function renderBooks() {
    const searchElement = document.getElementById('search');
    const sortElement = document.getElementById('sort');

    const searchQuery = searchElement ? searchElement.value.trim().toLowerCase() : '';
    const sortOrder = sortElement ? sortElement.value : '';

    fetch(`${apiUrl}?search=${encodeURIComponent(searchQuery)}&sort=${sortOrder}`)
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById('book-list');
            if (bookList) {
                bookList.innerHTML = '';
                books.forEach(book => {
                    bookList.innerHTML += `
                        <div class="book">
                            <h3>${book.title}</h3>
                            <p>Author: ${book.author}</p>
                            <p>Pages: ${book.pages}</p>
                            <p>Description: ${book.description}</p>
                            <p>Price: ${book.price} UAH</p>
                            <button onclick="editBook('${book.id}')">Edit</button>
                            <button onclick="deleteBook('${book.id}')">Delete</button>
                        </div>
                    `;
                });
            }
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Функція для створення книги
function createBook(book) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(() => {
            window.location.href = 'index.html'; // Переадресація на головну сторінку після успіху
        })
        .catch(error => {
            // Відображаємо повідомлення про помилку у відповідному елементі
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

// Функція для завантаження книги для редагування
function loadBookForEdit(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(book => {
            if (book) {
                document.getElementById('title').value = book.title;
                document.getElementById('author').value = book.author;
                document.getElementById('pages').value = book.pages;
                document.getElementById('description').value = book.description;
                document.getElementById('price').value = book.price;
            }
        })
        .catch(error => console.error('Error loading book for edit:', error));
}

// Функція для оновлення книги
// Функція для оновлення книги
function updateBook(id, book) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(() => {
            window.location.href = 'index.html'; // Переадресація на головну сторінку після успіху
        })
        .catch(error => {
            // Відображаємо повідомлення про помилку у відповідному елементі
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

// Функція для видалення книги
function deleteBook(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        renderBooks(); // Оновлення списку після видалення
    })
    .catch(error => console.error('Error deleting book:', error));
}

// Функція для переходу на сторінку редагування
function editBook(id) {
    window.location.href = `edit.html?id=${id}`;
}

// Функція для отримання загальної ціни з сервера
function countTotalPrice() {
    fetch('/api/books/total-price')
        .then(response => response.json())
        .then(data => {
            // Перевірка, чи є totalPrice у відповіді
            const totalPrice = data.totalPrice !== undefined ? data.totalPrice : 0;
            document.getElementById('total-price').textContent = totalPrice;
        })
        .catch(error => console.error('Error fetching total price:', error));
}
