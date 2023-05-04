import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import StatisticsAD from './ad/StatisticsAD';
import "./Statistics.css"
import StatisticsProgeria from "./progeria/StatisticsProgeria";

function Statistics(){

    const [data, setData] = useState(JSON.parse(localStorage.getItem('selectedDataset')))
    const [selectedDisease, setSelectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))

    console.log(selectedDisease)

    const renderForm = (
        <div>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="table-position">
                    <MDBTable scrollY maxHeight="300px">
                        <MDBTableHead columns={data.columns}/>
                        <MDBTableBody rows={data.rows} />
                    </MDBTable>
                </div>
                {selectedDisease === "Alzheimer's disease" ?
                    <StatisticsAD data={data} />
                :
                    <StatisticsProgeria data={data} />
                }
                <div className="button-container-row">
                    <div className="input-container-col">
                        <Link to="/ChooseDataset">
                            <button className="go-back-button">Go back</button>
                        </Link>
                    </div>
                    <div className="input-container-col">
                        <input type="submit" value="Next"/>
                    </div>
                </div>
            </div>
        </div>
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

export default Statistics;