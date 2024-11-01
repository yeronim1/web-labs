const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware для обробки JSON і статичних файлів
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Читання книг з books.json
const getBooks = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'books.json'), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Запис даних у books.json
const saveBooks = (books) => {
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
};

// ---- CRUD Маршрути ----

// 1. Отримати всі книги (з пошуком і сортуванням)
app.get('/api/books', (req, res) => {
    let filteredBooks = getBooks();

    const { search, sort } = req.query;

    // Пошук за назвою або автором
    if (search) {
        const searchLower = search.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower)
        );
    }

    // Сортування за ціною
    if (sort === 'asc') {
        filteredBooks.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        filteredBooks.sort((a, b) => b.price - a.price);
    }

    res.json(filteredBooks);
});

// 2. Додати нову книгу
app.post('/api/books', (req, res) => {
    const books = getBooks();
    const { title, author } = req.body;

    // Перевірка на унікальність за назвою та автором
    const bookExists = books.some(book => book.title === title && book.author === author);
    if (bookExists) {
        return res.status(400).json({ message: 'Книга з такою назвою та автором вже існує.' });
    }

    // Якщо книги з таким ім'ям та автором немає, створюємо нову
    const newBook = { ...req.body, id: Date.now().toString() };
    books.push(newBook);
    saveBooks(books);
    res.status(201).json(newBook);
});

// Маршрут для підрахунку загальної ціни всіх книг
app.get('/api/books/total-price', (req, res) => {
    const books = getBooks();
    const totalPrice = books.reduce((sum, book) => sum + parseFloat(book.price || 0), 0);
    res.json({ totalPrice });
});

// 3. Отримати одну книгу за ID
app.get('/api/books/:id', (req, res) => {
    const books = getBooks();
    const book = books.find(b => b.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// 4. Редагувати книгу за ID
app.put('/api/books/:id', (req, res) => {
    const books = getBooks();
    const bookIndex = books.findIndex(b => b.id === req.params.id);

    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        saveBooks(books);
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// 5. Видалити книгу за ID
app.delete('/api/books/:id', (req, res) => {
    const books = getBooks();
    const updatedBooks = books.filter(b => b.id !== req.params.id);

    if (updatedBooks.length !== books.length) {
        saveBooks(updatedBooks);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
