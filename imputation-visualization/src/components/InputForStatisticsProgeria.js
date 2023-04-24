import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";

export default function InputForStatisticsProgeria({ data }){

    const [data, setData] = useState(JSON.parse(localStorage.getItem('selectedDataset')))
    const [selectedDisease, setSelectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))

    console.log(data);
    console.log(selectedDisease)

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const renderForm = (
        <form onSubmit = {handleSubmit}>
            <div className="button-container-col">
                <h2>Generate statistics on the incomplete dataset</h2>
                <div>
                    <label>Username </label>
                </div>
                <div className="button-container-row">
                    <div className="input-container-col">
                        <Link to="/InsertData">
                            <button className="go-back-button">Go back</button>
                        </Link>
                    </div>
                    <div className="input-container-col">
                        <input type="submit" value="Next"/>
                    </div>
                </div>
            </div>
        </form>
    );

    return (
        <div className="app">
            <div>
                {renderForm}
                <Outlet />
            </div>
        </div>
    );
}
