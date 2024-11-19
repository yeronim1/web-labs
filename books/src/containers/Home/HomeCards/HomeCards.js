import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeCards.css';
import CardItem from '../../../components/card_item/CardItem.js';
import getImageSrc from '../../../components/card_item/CardItem.js';

const HomeCards = () => {
    const [initialCards, setInitialCards] = useState([]);
    const [additionalCards, setAdditionalCards] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchCards = () => {
            axios.get('/api/cards', { params: { limit: 3, offset: 0 } })
                .then(response => {
                    setInitialCards(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cards:', error);
                });
        };

        fetchCards();

    }, []);


    const showMoreCards = () => {
        axios.get('/api/cards', {
            params: { limit: 10, offset: 3 }
        })
            .then(response => {
                setAdditionalCards(response.data);
                setShowAll(true);
            })
            .catch(error => {
                console.error('Error fetching additional cards:', error);
            });
    };

    const hideCards = () => {
        axios.get('/api/cards', { params: { limit: 3, offset: 0 } })
            .then(response => {
                setAdditionalCards([]);
                setShowAll(false);
            })
            .catch(error => {
                console.error('Error fetching initial cards:', error);
            });
    };

    return (
        <div>
            <div className='home__cards'>
                {initialCards.map((card, index) => {
                    const imageSrc = getImageSrc(card.imgpath);
                    return (
                        <CardItem
                            key={index}
                            {...card}
                            index={index}
                            imageSrc={imageSrc}
                        />
                    );
                })}
                {showAll && additionalCards.map((card, index) => {
                    const imageSrc = getImageSrc(card.imgpath);
                    return (
                        <CardItem
                            key={index + initialCards.length}
                            {...card}
                            index={index + initialCards.length}
                            imageSrc={imageSrc}
                        />
                    );
                })}
            </div>
            {!showAll && (
                <div className='home__cards-button'>
                    <button onClick={showMoreCards}>
                        View More
                    </button>
                </div>
            )}
            {showAll && (
                <div className='home__cards-button'>
                    <button onClick={hideCards}>
                        Hide
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeCards;