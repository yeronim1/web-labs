import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../Redux/CartSlice.js';
import axios from 'axios';
import './ItemPage.css';
import { getImageSrc } from '../../components/card_item/CardItem.js';
import Loader from '../../components/Loader/Loader.js';

function ItemPage() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState('Hardcover');
    const [amount, setAmount] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/cards/${id}`)
            .then(response => {
                const cardData = response.data;
                cardData.imageSrc = getImageSrc(cardData.imgpath);
                setCard(cardData);
            })
            .catch(error => {
                console.error('Error fetching card:', error);
                setError('Failed to load card');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
        setAmount(1);
    };

    const addToCart = async () => {
        const stockAmount = card.stock.find(stockItem => stockItem.cover === selectedColor)?.amount || 0;

        if (amount > stockAmount) {
            alert('Cannot add item to cart, out of stock');
            return;
        }

        try {
            const response = await axios.patch('/api/cards-catalog', {
                id: card.id,
                cover: selectedColor,
                amount: amount
            });

            if (response.data.success) {
                const updatedCard = response.data.updatedCard;
                updatedCard.imageSrc = card.imageSrc;
                setCard(updatedCard);

                const existingItem = cart.find(item => item.id === card.id && item.cover === selectedColor);
                let updatedCart;

                if (existingItem) {
                    updatedCart = cart.map(item =>
                        item.id === card.id && item.cover === selectedColor
                            ? { ...item, quantity: item.quantity + amount }
                            : item
                    );
                } else {
                    updatedCart = [...cart, { ...card, cover: selectedColor, quantity: amount }];
                }

                dispatch(setCart(updatedCart));
                alert('Item added to cart');
            } else {
                alert('Failed to update stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!card) {
        return <div>Card not found</div>;
    }

    const stockAmount = card.stock.find(stockItem => stockItem.cover === selectedColor)?.amount || 0;

    return (
        <div>
            <div className='itempage__main'>
                <div className='main__info'>
                    <img src={card.imageSrc} alt={card.title} />
                    <div className='main__info__right'>
                        <article>
                            <h1>{card.title}</h1>
                            <p>{card.text}</p>
                        </article>
                        <h3>In stock: {stockAmount}</h3>
                        <div className="main__info-selects">
                            <div className="main__info-selects__count">
                                <p>Amount:</p>
                                <input
                                    id="content__cost"
                                    type="number"
                                    min={stockAmount === 0 ? 0 : 1}
                                    max={stockAmount}
                                    className="content__cost-input"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>
                            <div className="main__info-selects__color">
                                <p>Cover:</p>
                                <select
                                    id="content__color"
                                    className="content__color-select"
                                    value={selectedColor}
                                    onChange={handleColorChange}
                                >
                                    {card.stock.map(stockItem => (
                                        <option key={stockItem.cover} value={stockItem.cover}>
                                            {stockItem.cover.charAt(0).toUpperCase() + stockItem.cover.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='main__price-buttons'>
                    <div className="main__price">
                        <p className="main__price-price">Price:</p>
                        <p>$ {card.price}</p>
                    </div>
                    <div className='buttons'>
                        <Link to='/catalog'>
                            <button className='buttons_go_back'>Go back</button>
                        </Link>
                        <button className='buttons_add_to_cart' onClick={addToCart}>Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;