
import React from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navigation">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/catalog">Catalog</Link></li>
                <li><a href="#services">Cast</a></li>
            </ul>
        </nav>
    )
}

export default Navigation;
