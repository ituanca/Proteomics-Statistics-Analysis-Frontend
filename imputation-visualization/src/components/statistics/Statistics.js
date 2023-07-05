import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import StatisticsAD from './ad/StatisticsAD';
import "./Statistics.css"
import StatisticsProgeria from "./progeria/StatisticsProgeria";
import StatisticsOther from "./other/StatisticsOther";
import axios from "axios";
import {getClassNameForColumnHeader} from "../utils/Utils";

function Statistics(){

    useEffect(() => {
        localStorage.setItem("chooseDatasetCompleted", JSON.stringify(true));
    },[])

    const tableData = JSON.parse(localStorage.getItem('selectedDataset'))
    const [selectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    const renderForm = (
        <div>
            <h1>Statistics</h1>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="table-position">
                    <div className="table-colors-legend">
                        <div className="legend-container-row"><div className='box id-color'/>ID</div>
                        <div className="legend-container-row"><div className='box class1-color'/>Class 1</div>
                        <div className="legend-container-row"><div className='box class2-color'/>Class 2</div>
                        <div className="legend-container-row"><div className='box other-columns-color'/>Other columns</div>
                    </div>
                    <div className="table-position-background">
                        <MDBTable scrollY maxHeight="400px">
                            <MDBTableHead>
                                <tr>
                                    {tableData.columns.map((columnHeader, index) => (
                                        <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                    ))}
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody rows={tableData.rows}/>
                        </MDBTable>
                    </div>
                </div>
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
                        <Link to="/ChooseOrUploadDataset">
                            <button className="general-button">Go back</button>
                        </Link>
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