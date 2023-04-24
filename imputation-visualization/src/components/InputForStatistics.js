import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

function InputForStatistics(){

    const [data, setData] = useState(JSON.parse(localStorage.getItem('selectedDataset')))
    const [selectedDisease, setSelectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))

    console.log(data);
    console.log(selectedDisease)

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const renderForm = (
        <form onSubmit = {handleSubmit}>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="table-position">
                    <MDBTable scrollY maxHeight="400px">
                        <MDBTableHead columns={data.columns}/>
                        <MDBTableBody rows={data.rows} />
                    </MDBTable>
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

export default InputForStatistics;