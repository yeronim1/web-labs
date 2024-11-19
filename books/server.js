import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = 5000;


app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCards = async () => {
    const filePath = path.join(__dirname, 'src/api/Cards.json');
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error accessing or reading Cards.json:', error);
        throw error;
    }
};

const getCart = async () => {
    const filePath = path.join(__dirname, 'src/api/Cart.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error accessing or reading Cart.json:', error);
        throw error;
    }
};

const saveCart = async (cart) => {
    const filePath = path.join(__dirname, 'src/api/Cart.json');
    try {
        await fs.writeFile(filePath, JSON.stringify(cart, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving Cart.json:', error);
        throw error;
    }
};


app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/cards', async (req, res) => {
    try {
        const { limit = 3, offset = 0 } = req.query;
        const cards = await getCards();
        const paginatedCards = cards.slice(Number(offset), Number(offset) + Number(limit));

        res.json(paginatedCards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load cards' });
    }
});


app.get('/api/cards-catalog', async (req, res) => {
    try {
        const { searchTerm = '', sortType = 'none', sortFeat = 'none', sortOrder = 'descending' } = req.query;
        let cards = await getCards();

        if (searchTerm) {
            cards = cards.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (sortType !== 'none') {
            cards = cards.filter(card => card.type === sortType);
        }

        if (sortFeat !== 'none') {
            cards = cards.sort((a, b) => {
                if (sortFeat === 'price') {
                    return sortOrder === 'descending' ? b.price - a.price : a.price - b.price;
                }
                if (sortFeat === 'name') {
                    return sortOrder === 'descending' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
                }
                return 0;
            });
        }

        await delay(500);

        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load cards' });
    }
});


app.get('/api/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cards = await getCards();
        const card = cards.find(card => card.id === parseInt(id, 10));

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        await delay(500);

        res.json(card);
    } catch (error) {
        console.error('Error loading card:', error);
        res.status(500).json({ error: 'Failed to load card' });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});