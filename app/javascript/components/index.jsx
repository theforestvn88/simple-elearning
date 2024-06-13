import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(<App />);
});
