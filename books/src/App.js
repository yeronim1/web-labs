import React from "react";
import Header from "./containers/Header/Header.js";
import Footer from "./containers/Footer/Footer.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/Home.js";
import Catalog from "./containers/Catalog/Catalog.js";
import ItemPage from "./containers/ItemPage/ItemPage.js";

function App() {

    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:id" element={<ItemPage />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
