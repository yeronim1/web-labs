import React from "react";
import Hero from "./Hero/Hero.js";
import HomeCards from "./HomeCards/HomeCards.js";
import DocumentTitle from "../../components/helmet/document_title.js";

function Home() {
    DocumentTitle("Home");
    return (
        <div>
            <Hero />
            <HomeCards />
        </div>
    );
}

export default Home;