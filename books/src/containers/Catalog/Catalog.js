import React, { useState } from "react";
import CatalogCards from "./CatalogCards/CatalogCards.js";
import DocumentTitle from "../../components/helmet/document_title.js";

function Catalog() {
    DocumentTitle("Catalog");
    return (
        <div>
            <CatalogCards/>
        </div>
    );
}

export default Catalog;