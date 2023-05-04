import React from "react";
import {Link, Outlet} from "react-router-dom";
import './StartPage.css';

function StartPage(){
    return (
        <div className="container-title-button">
            <label className="title"><strong>Biostatistics Visualization</strong></label>
            <nav>
                <div>
                    <Link to="/ChooseDataset">
                        <button className="start-button">Start</button>
                    </Link>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default StartPage;