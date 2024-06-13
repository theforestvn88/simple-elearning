import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../components/Home";

export default (
    <BrowserRouter>
        {/* https://reactrouter.com/en/v6.3.0/upgrading/v5#upgrade-all-switch-elements-to-routes */}
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </BrowserRouter>
);
