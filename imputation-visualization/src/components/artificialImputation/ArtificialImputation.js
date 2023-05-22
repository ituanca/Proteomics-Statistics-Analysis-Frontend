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
    const [selectedOptionClass, setSelectedOptionClass] = useState({
        type_of_imputation: ""
    });
    const [nrOfRowsInTheOriginalTable, setNrOfRowsInTheOriginalTable] = useState(0);
    useEffect(() => {
        setNrOfRowsInTheOriginalTable(tableData.rows.length)
    }, [tableData])

    const [nrOfRowsInTheMissingEliminatedTable, setNrOfRowsInTheMissingEliminatedTable] = useState(0);
    useEffect(() => {
        setNrOfRowsInTheMissingEliminatedTable(missingEliminatedTableData.rows.length)
    }, [missingEliminatedTableData])

    const handleEliminateRowsWithNaValues = () => {
        if(!rowsWithNaEliminated){
            axios
                .post("http://localhost:8000/eliminateRowsWithNaValues")
                .then((response) => {
                    console.info(response.data);
                    setMissingEliminatedTableData({
                        ...missingEliminatedTableData, columns: Object.keys(response.data[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: response.data
                    })
                    setRowsWithNaEliminated(true);
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    const[naValuesInserted, setNaValuesInserted] = useState(false)
    const[paramsForNaInsertionChanged, setParamsForNaInsertionChanged] = useState(false)
    const[missingInsertedTableData, setMissingInsertedTableData] = useState({
        columns: [],
        rows: []
    })
    const [missingInsertedDataZeroesMarked, setMissingInsertedDataZeroesMarked] = useState( {
        columns: [],
        rows: []
    })

    useEffect( () => {
        if(missingInsertedTableData.rows.length > 0){
            for(let i = 0; i < missingInsertedTableData.rows.length; i++){
                for(let j = 0; j < missingInsertedTableData.columns.length; j++){
                    const crtCell = missingInsertedTableData.rows[i][missingInsertedTableData.columns[j].label]
                    if(parseInt(crtCell) === 0) {
                        setMissingInsertedDataZeroesMarked((prevState => {
                            const newState = {...prevState};
                            newState.rows[i][newState.columns[j].label] = true
                            return newState
                        }))
                    }else{
                        setMissingInsertedDataZeroesMarked((prevState => {
                            const newState = {...prevState};
                            newState.rows[i][newState.columns[j].label] = false
                            return newState
                        }))
                    }
                }
            }
        }
    }, [missingInsertedTableData])

    useEffect(() => {
        if(paramsForNaInsertionChanged){
            fetch('http://localhost:8000/getMissingInsertedDfNewGeneral')
                .then((response) => response.json())
                .then((json) => {
                    const tempMissingInsertedTableData = { columns: Object.keys(json[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: json
                    }
                    setMissingInsertedTableData(tempMissingInsertedTableData)
                    const tempMissingInsertedDataZeroesMarked = JSON.parse(JSON.stringify(tempMissingInsertedTableData))
                    setMissingInsertedDataZeroesMarked(tempMissingInsertedDataZeroesMarked)
                    setParamsForNaInsertionChanged(false);
                })
                .catch((error) => console.log(error));
        }
    }, [paramsForNaInsertionChanged])

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
                    setParamsForNaInsertionChanged(true);
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    const [imputationMethods, setImputationMethods] = useState([])
    const [filterForChoiceOfImputationType, setFilterForChoiceOfImputationType] = useState({
        name: "type_of_imputation",
        label: "Choose the way to perform the imputation",
        type: "select",
        values: []
    });

    useEffect(() => {
        if(naValuesInserted){
            fetch('http://localhost:8000/getImputationMethods')
                .then((response) => response.json())
                .then((json) => {
                    setImputationMethods(json)
                })
                .catch((error) => console.log(error));
            fetch('http://localhost:8000/getImputationOptionsClass')
                .then((response) => response.json())
                .then((json) => {
                    setFilterForChoiceOfImputationType({...filterForChoiceOfImputationType, values: json});
                    setSelectedOptionClass({...selectedOptionClass, type_of_imputation: json[0]});
                })
                .catch((error) => console.log(error));
        }
    }, [naValuesInserted])

    const [imputationPerformed, setImputationPerformed] = useState(false);
    const [listOfImputedTables, setListOfImputedTables] = useState([{
        columns: [],
        rows: []
    }])

    // send request to perform all imputation methods and receive the imputed dataframes as a response
    const handlePerformImputation = () => {
        axios
            .post("http://localhost:8000/performAllImputationMethods", JSON.stringify(selectedOptionClass))
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

    const handleOptionClassChange = (value) => {
        setSelectedOptionClass(value);
    };

    const mapCells = (data, markedData) => {
        return data.rows.map((row, indexRow) => (
            <tr key={indexRow}>
                {data.columns.map((column, indexCol) => (
                        <React.Fragment key={indexCol}>
                            {(markedData.rows[indexRow][column.label] === true) ?
                                <td className="text-color-zero-imputation">{data.rows[indexRow][column.label]}</td>
                                :
                                <td className="text-color-non-zero-imputation">{data.rows[indexRow][column.label]}</td>}
                        </React.Fragment>
                    )
                )}
            </tr>
        ))
    }

    const renderForm = (
        <div>
            <h1>Artificial imputation</h1>
            <h2>{selectedDisease} dataset</h2>
            <div className="button-container-col">
                <div className="container-artificial-imputation">
                    <div className="table-colors-legend">
                        <div className="legend-container-row"><div className='box id-color'/>ID</div>
                        <div className="legend-container-row"><div className='box class1-color'/>Class 1</div>
                        <div className="legend-container-row"><div className='box class2-color'/>Class 2</div>
                        <div className="legend-container-row"><div className='box other-columns-color'/>Other columns</div>
                    </div>
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
                            <div className="table-nr-rows"><label>The table has {nrOfRowsInTheOriginalTable} rows</label></div>
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
                                <div className="table-nr-rows"><label>The table has {nrOfRowsInTheMissingEliminatedTable} rows</label></div>
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
                                        <MDBTableBody>
                                            {mapCells(missingInsertedTableData, missingInsertedDataZeroesMarked)}
                                        </MDBTableBody>
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
                                <div className="label-field-group-with-space">
                                    <label className="label-statistics">Select the way to perform the imputation</label>
                                    <select className="input-for-statistics-ad-select"
                                            value={selectedOptionClass[filterForChoiceOfImputationType.name]}
                                            onChange={(e) => handleOptionChange(filterForChoiceOfImputationType.name, e.target.value, selectedOptionClass, setSelectedOptionClass)}
                                    >
                                        {filterForChoiceOfImputationType.values.map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {renderErrorMessage("params_not_specified", errorMessages)}
                                <button className="general-button" onClick={handlePerformImputation}>
                                    View the result
                                </button>
                            </div>
                        }
                        { rowsWithNaEliminated && naValuesInserted && imputationPerformed &&
                            <StatisticsOnArtificialImputation listOfImputedDataframes={listOfImputedTables} markedData={missingInsertedDataZeroesMarked} imputationMethods={imputationMethods}/>
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