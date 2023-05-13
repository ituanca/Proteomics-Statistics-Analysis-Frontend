import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import StatisticsAD from './ad/StatisticsAD';
import "./Statistics.css"
import StatisticsProgeria from "./progeria/StatisticsProgeria";
import StatisticsOther from "./other/StatisticsOther";
import axios from "axios";

function Statistics(){

    const tableData = JSON.parse(localStorage.getItem('selectedDataset'))
    const [selectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    console.log(selectedOptionsForTable)

    // send the filters for the dataset to the backend and receive them back as a response
    useEffect(() => {
        axios
            .post("http://localhost:8000/sendSelectedOptionsForTable", JSON.stringify(selectedOptionsForTable))
            .then((response) => {
                console.info(response);
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }, [])

    const renderForm = (
        <div>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="table-position">
                    <MDBTable scrollY maxHeight="300px">
                        <MDBTableHead columns={tableData.columns}/>
                        <MDBTableBody rows={tableData.rows} />
                    </MDBTable>
                </div>
                {/*{(selectedDisease === "Alzheimer's disease") && <StatisticsAD />}*/}
                {/*{(selectedDisease === "Progeria") && <StatisticsProgeria />}*/}
                {(selectedDisease === "Alzheimer's disease") ? (
                    <StatisticsAD />
                ) : (
                    (selectedDisease === "Progeria") ? (
                        <StatisticsProgeria />
                    ) : (
                        <StatisticsOther />
                    )
                )}
                {/*{(selectedDisease === "Other") && <StatisticsOther />}*/}
                <div className="button-container-row">
                    <div className="input-container-col">
                        <Link to="/ChooseDataset">
                            <button className="general-button">Go back</button>
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