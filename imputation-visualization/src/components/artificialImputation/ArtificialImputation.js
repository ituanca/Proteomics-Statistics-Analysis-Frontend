import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import "./ArtificialImputation.css"
import axios from "axios";
import {handleOptionChange, renderErrorMessage} from "../Utils";
import StatisticsOnArtificialImputation from "./StatisticsOnArtificialImputation";

export default function ArtificialImputation(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        params_not_specified: "You have to specify the parameters needed fo the missing values insertion",
        out_of_bounds: "The values must belong to the interval [0,100]",
    };
    const tableData = JSON.parse(localStorage.getItem('selectedDataset'))
    const [selectedDisease] = useState(JSON.parse(localStorage.getItem('selectedDisease')))
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    const [rowsWithNaEliminated, setRowsWithNaEliminated] = useState(false);
    const [missingEliminatedTableData, setMissingEliminatedTableData] = useState({
        columns: [],
        rows: []
    });
    const [paramsForNaInsertion, setParamsForNaInsertion] = useState({
        percentage_missing_data: "",
        MNAR_rate: ""
    })

    useEffect(() => {
        if(rowsWithNaEliminated){
            fetch('http://localhost:8000/getMissingEliminatedDfNewGeneral')
                .then((response) => response.json())
                .then((json) => {
                    setMissingEliminatedTableData({
                        ...missingEliminatedTableData, columns: Object.keys(json[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: json
                    })
                })
                .catch((error) => console.log(error));
        }
    }, [rowsWithNaEliminated])

    const handleEliminateRowsWithNaValues = () => {
        if(!rowsWithNaEliminated){
            axios
                .post("http://localhost:8000/eliminateRowsWithNaValues")
                .then((response) => {
                    console.info(response);
                    setRowsWithNaEliminated(true);
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    const[naValuesInserted, setNaValuesInserted] = useState(false)
    const[paramsChanged, setParamsChanged] = useState(false)
    const[missingInsertedTableData, setMissingInsertedTableData] = useState({
        columns: [],
        rows: []
    })

    useEffect(() => {
        if(paramsChanged){
            fetch('http://localhost:8000/getMissingInsertedDfNewGeneral')
                .then((response) => response.json())
                .then((json) => {
                    setMissingInsertedTableData({
                        ...missingInsertedTableData, columns: Object.keys(json[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: json
                    })
                    setParamsChanged(false);
                })
                .catch((error) => console.log(error));
        }
    }, [paramsChanged])

    const validateParams = () => {
        if(paramsForNaInsertion.percentage_missing_data === "" || paramsForNaInsertion.MNAR_rate === ""){
            setErrorMessages({name: "params_not_specified", message: errors.params_not_specified});
        }else if (parseInt(paramsForNaInsertion.percentage_missing_data) < 0 || parseInt(paramsForNaInsertion.percentage_missing_data) > 100 ||
            parseInt(paramsForNaInsertion.MNAR_rate) < 0 || parseInt(paramsForNaInsertion.MNAR_rate) > 100){
            setErrorMessages({name: "out_of_bounds", message: errors.out_of_bounds});
        }else{
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleInsertRandomNaValues = () => {
        if(validateParams()){
            axios
                .post("http://localhost:8000/insertRandomMissingValues", JSON.stringify(paramsForNaInsertion))
                .then((response) => {
                    console.info(response);
                    setNaValuesInserted(true);
                    setParamsChanged(true);
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    const [imputationMethods, setImputationMethods] = useState([])

    useEffect(() => {
        if(naValuesInserted){
            fetch('http://localhost:8000/getImputationMethods')
                .then((response) => response.json())
                .then((json) => {
                    setImputationMethods(json)
                })
                .catch((error) => console.log(error));
        }
    }, [naValuesInserted])

    const [imputationPerformed, setImputationPerformed] = useState(false);
    const [listOfImputedTables, setListOfImputedTables] = useState([{
        columns: [],
        rows: []
    }])

    // useEffect(() => {
    //     if(imputationPerformed){
    //         fetch('http://localhost:8000/getListOfImputedTables')
    //             .then((response) => response.json())
    //             .then((json) => {
    //                 setListOfImputedTables(json)
    //             })
    //             .catch((error) => console.log(error));
    //     }
    // }, [imputationPerformed, listOfImputedTables])

    const handlePerformImputation = () => {
        axios
            .post("http://localhost:8000/performAllImputationMethods")
            .then((response) => {
                console.info(response.data);
                setImputationPerformed(true);
                setListOfImputedTables(response.data)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }

    const getClassNameForColumnHeader = (columnHeader) => {
        if(selectedOptionsForTable.class1.includes(columnHeader.label)){
            return "column-header-class1"
        }else if(selectedOptionsForTable.class2.includes(columnHeader.label)){
            return "column-header-class2"
        }else if(selectedOptionsForTable.other_columns.includes(columnHeader.label)){
            return "column-header-other-columns";
        }else if(selectedOptionsForTable.id === columnHeader.label){
            return "column-header-id";
        }
        return "column-header-other-columns";
    }

    const handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        setParamsForNaInsertion({ ...paramsForNaInsertion, [name] : value});
        console.log(paramsForNaInsertion);
    }

    const renderForm = (
        <div>
            <h1>Artificial imputation</h1>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="table-colors-legend">
                    <div className="legend-container-row"><div className='box id-color'/>ID</div>
                    <div className="legend-container-row"><div className='box class1-color'/>Class 1</div>
                    <div className="legend-container-row"><div className='box class2-color'/>Class 2</div>
                    <div className="legend-container-row"><div className='box other-columns-color'/>Other columns</div>
                </div>
                <div className="container-artificial-imputation">
                    <div className="container-col-artificial-imputation">
                        <div className="table-position">
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
                        <div className="center-positioning">
                            <h3> 1. Eliminate the rows containing at least one missing value</h3>
                            <button className="general-button" onClick={handleEliminateRowsWithNaValues}>
                                View the updated table
                            </button>
                        </div>
                        { rowsWithNaEliminated &&
                            <div className="table-position">
                                <div className="table-position-background">
                                    <MDBTable scrollY maxHeight="400px">
                                        <MDBTableHead>
                                            <tr>
                                                {missingEliminatedTableData.columns.map((columnHeader, index) => (
                                                    <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                                ))}
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody rows={missingEliminatedTableData.rows}/>
                                    </MDBTable>
                                </div>
                            </div> }
                        { rowsWithNaEliminated &&
                            <div className="center-positioning">
                                <h3> 2. Insert random missing values by choosing the percentage of missing data and the rate of Missing-Not-At-Random</h3>
                                <div className="label-field-group-with-space">
                                    <label className="label-statistics">Insert the percentage of missing values</label>
                                    <input type="number"
                                           value={paramsForNaInsertion.percentage_missing_data}
                                           onChange={handleInput}
                                           name="percentage_missing_data" required
                                           id="percentage_missing_data"/>
                                </div>
                                <div className="label-field-group-with-space">
                                    <label className="label-statistics">Insert the rate of Missing-Not-At-Random</label>
                                    <input type="number"
                                           value={paramsForNaInsertion.MNAR_rate}
                                           onChange={handleInput}
                                           name="MNAR_rate" required
                                           id="MNAR_rate"/>
                                </div>
                                {renderErrorMessage("params_not_specified", errorMessages)}
                                {renderErrorMessage("out_of_bounds", errorMessages)}
                                <button className="general-button" onClick={handleInsertRandomNaValues}>
                                    View the updated table
                                </button>
                            </div>
                        }
                        { rowsWithNaEliminated && naValuesInserted  &&
                            <div className="table-position">
                                <div className="table-position-background">
                                    <MDBTable scrollY maxHeight="400px">
                                        <MDBTableHead>
                                            <tr>
                                                {missingInsertedTableData.columns.map((columnHeader, index) => (
                                                    <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                                ))}
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody rows={missingInsertedTableData.rows}/>
                                    </MDBTable>
                                </div>
                            </div>
                        }
                        { rowsWithNaEliminated && naValuesInserted &&
                            <div className="center-positioning">
                                <h3>
                                    <p> 3. Perform imputation using all the available imputation techniques:</p>
                                    {imputationMethods.map((method, index) =>
                                        <li key={index} className="list-item">{method}{index === imputationMethods.length - 1 ? '' : ', '}</li>
                                    )}
                                </h3>
                                <button className="general-button" onClick={handlePerformImputation}>
                                    View the imputed tables
                                </button>
                            </div>
                        }
                        { rowsWithNaEliminated && naValuesInserted && imputationPerformed &&
                            <StatisticsOnArtificialImputation listOfImputedTables={listOfImputedTables}/>
                        }
                    </div>
                </div>
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