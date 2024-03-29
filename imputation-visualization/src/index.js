import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./components/startPage/StartPage";
import ChooseOrUploadDataset from "./components/chooseOrUploadDataset/ChooseOrUploadDataset";
import Statistics from "./components/statistics/Statistics";
import ArtificialImputation from "./components/artificialImputation/ArtificialImputation";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/StartPage" element={<StartPage />} />
            <Route path="/ChooseOrUploadDataset" element={<ChooseOrUploadDataset />} />
            <Route path="/Statistics" element={<Statistics />} />
            <Route path="/ArtificialImputation" element={<ArtificialImputation />} />
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
