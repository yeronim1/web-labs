import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementQuantity, decrementQuantity, setCart, removeItem } from '../../Redux/CartSlice.js';
import './Cart.css';
import { getImageSrc } from "../../components/card_item/CardItem.js";
import DocumentTitle from '../../components/helmet/document_title.js';
import Loader from '../../components/Loader/Loader.js';
import axios from 'axios';

function Cart() {
    DocumentTitle('Cart');
    const cart = useSelector(state => state.cart.items);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState({});

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await axios.get('/api/cards-catalog');
                const stockData = response.data.reduce((acc, card) => {
                    card.stock.forEach(stockItem => {
                        acc[`${card.id}-${stockItem.cover}`] = stockItem.amount;
                    });
                    return acc;
                }, {});
                setStock(stockData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStock();
    }, [dispatch]);

    const handleIncrement = async (itemId, itemColor) => {
        const stockKey = `${itemId}-${itemColor}`;
        const stockAmount = stock[stockKey] || 0;

        try {
            const response = await axios.patch('/api/update-stock', {
                id: itemId,
                cover: itemColor,
                amount: -1
            });

            if (response.data.success) {
                const updatedCart = cart.map(item =>
                    item.id === itemId && item.cover === itemColor ? { ...item, quantity: item.quantity + 1 } : item
                );
                dispatch(incrementQuantity({ id: itemId, cover: itemColor }));
                setStock(prevStock => ({
                    ...prevStock,
                    [stockKey]: prevStock[stockKey] - 1
                }));
            } else {
                alert('Failed to update stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    const handleDecrement = async (itemId, itemColor) => {
        const item = cart.find(item => item.id === itemId && item.cover === itemColor);

        try {
            const response = await axios.patch('/api/update-stock', {
                id: itemId,
                cover: itemColor,
                amount: 1
            });

            if (response.data.success) {
                const updatedCart = cart.reduce((acc, item) => {
                    if (item.id === itemId && item.cover === itemColor) {
                        if (item.quantity > 1) {
                            acc.push({ ...item, quantity: item.quantity - 1 });
                        }
                    } else {
                        acc.push(item);
                    }
                    return acc;
                }, []);

                if (item.quantity > 1) {
                    dispatch(decrementQuantity({ id: itemId, cover: itemColor }));
                } else {
                    dispatch(removeItem({ id: itemId, cover: itemColor }));
                }
                setStock(prevStock => ({
                    ...prevStock,
                    [`${itemId}-${itemColor}`]: prevStock[`${itemId}-${itemColor}`] + 1
                }));
            } else {
                alert('Failed to update stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const imageSrc = (imgpath) => getImageSrc(imgpath);

    return (
        <>
            <div className="cart">
                <h1>Shopping Cart</h1>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {cart.length === 0 ? (
                            <div>
                                <h2 className="cart_empty_text">Your cart is empty</h2>
                                <div className="cart__button">
                                    <Link to="/catalog">
                                        <button className="back_to_catalog">Back to catalog</button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.cover}`} className="cart__item">
                                        <img
                                            className="cart__item-image"
                                            src={imageSrc(item.imgpath)}
                                            alt={item.title}
                                        />
                                        <div className="cart__item-details ">
                                            <h2>{item.title} ({item.cover})</h2>
                                            <div className="cart__item-quantity">
                                                <button onClick={() => handleDecrement(item.id, item.cover)}>
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrement(item.id, item.cover)}
                                                    disabled={stock[`${item.id}-${item.cover}`] <= 0}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p>$ {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="cart__summary-price">
                                    <h2 className="h">Total amount: </h2>
                                    <h2>$ {totalPrice}</h2>
                                </div>
                                <div className="cart__buttons ">
                                    <Link to="/catalog">
                                        <button className="back_to_catalog">Back to catalog</button>
                                    </Link>
                                    <button className="continue">Continue</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Cart;