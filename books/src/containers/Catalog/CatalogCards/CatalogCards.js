import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CatalogCards.css';
import CardItem from '../../../components/card_item/CardItem.js';
import Filters from '../Filters/Filters.js';
import { getImageSrc } from '../../../components/card_item/CardItem.js';
import Loader from '../../../components/Loader/Loader.js';

function CatalogCards() {

    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('none');
    const [sortFeat, setSortFeat] = useState('none');
    const [sortOrder, setSortOrder] = useState('descending');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCards = () => {
            setLoading(true);
            axios.get('/api/cards-catalog', { params: { searchTerm, sortType, sortFeat, sortOrder } })
                .then(response => {
                    setCards(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cards:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchCards();

    }, [searchTerm, sortType, sortFeat, sortOrder]);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortTypeChange = (event) => {
        setSortType(event.target.value);
    };

    const handleSortFeatChange = (event) => {
        setSortFeat(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div>
            <Filters
                onSortTypeChange={handleSortTypeChange}
                onSortFeatChange={handleSortFeatChange}
                onSortOrderChange={handleSortOrderChange}
                onSearch={handleSearch}
            />
            {loading && <Loader />}
            {!loading && (
                <div className='home__cards'>
                    {cards.map((card, index) => {
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
                </div>
            )}

        </div>
    );
}

export default CatalogCards;