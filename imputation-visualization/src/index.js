import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./components/StartPage";
import InsertData from "./components/InsertData";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/StartPage" element={<StartPage />} />
            <Route path="/InsertData" element={<InsertData />} />
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
