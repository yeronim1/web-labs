import React from "react";
import './CardItem.css';
import { Link, useLocation } from 'react-router-dom';
import HarryPotter from '../image/harry_potter.jpg';
import WillyWonka from '../image/willy_wonka.jpg';
import AlicesAdventures from '../image/alices_adventures.jpg';
import LordRings from '../image/lord_rings.jpg';

export function getImageSrc(imgpath) {
    switch (imgpath) {
        case 'Harry potter':
            return HarryPotter;
        case 'Willy Wonka':
            return WillyWonka;
        case 'Alices Adventures':
            return AlicesAdventures;
        case 'The lord of the rings':
            return LordRings;
        default:
            return null; // or a default image
    }
}

function CardItem({ id, title, text, imgpath, price }) {
    const location = useLocation();
    const imageSrc = getImageSrc(imgpath);

    return (
        <div className="cards_content">
            {imageSrc && <img src={imageSrc} alt={title} className="cards__photo" />}
            <article>
                <h3 className="cards_title">{title}</h3>
                <p className="cards_desc">{text}</p>
                {location.pathname === '/catalog' && (
                    <div className="cards_price">
                        <p className="cards_price-price">Price:</p>
                        <p>{price} $</p>
                    </div>
                )}
            </article>
            {location.pathname === '/catalog' && (
                <div className="cards__button-container">
                    <Link to={`/catalog/${id}`}>
                        <button className="cards__button">View More</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default CardItem;