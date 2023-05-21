import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {handleOptionChange} from "../Utils";


export default function ImputationExecution(){

    const [selectedMethod, setSelectedMethod] = useState({
        imputation_method: ""
    });
    const [incompleteFullGeneral, setIncompleteFullGeneral] = useState([])
    const [imputedGeneral, setImputedGeneral] = useState([])
    const [incompleteData, setIncompleteData] = useState( {
        columns: [],
        rows: []
    })
    const [imputedData, setImputedData] = useState( {
        columns: [],
        rows: []
    })
    const [filterForChoiceOfImputationMethod, setFilterForChoiceOfImputationMethod] = useState({
        name: "imputation_method",
        label: "Choose the imputation method",
        type: "select",
        values: []
    });

    const [incompleteDataZeroesMarked, setIncompleteDataZeroesMarked] = useState( {
        columns: [],
        rows: []
    })

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
                setSelectedMethod({...selectedMethod, imputation_method: json[0]});
            })
            .catch((error) => console.log(error));
    }, [])


    useEffect( () => {
        if(incompleteData.length > 0){
            for(let i = 0; i < incompleteData.rows.length; i++){
                for(let j = 0; j < incompleteData.columns.length; j++){
                    if(parseInt(incompleteData.rows[i][incompleteData.columns[j].label]) === 0) {
                        setIncompleteDataZeroesMarked((prevState => {
                            const newState = {...prevState};
                            newState.rows[i][newState.columns[j].label] = true
                            return newState
                        }))
                    }else if (!isNaN(incompleteData.rows[i][incompleteData.columns[j].label])){
                        setIncompleteDataZeroesMarked((prevState => {
                            const newState = {...prevState};
                            newState.rows[i][newState.columns[j].label] = false
                            return newState
                        }))
                    }
                }
            }
        }
    }, [incompleteData])

    console.log(incompleteDataZeroesMarked)

    useEffect(() => {
        if(incompleteFullGeneral.length > 0) {
            setIncompleteData({...incompleteData, columns: Object.keys(incompleteFullGeneral[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: incompleteFullGeneral})
            setIncompleteDataZeroesMarked({...incompleteData, columns: Object.keys(incompleteFullGeneral[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: incompleteFullGeneral})
        }
        if(imputedGeneral.length > 0) {
            setImputedData({...imputedData, columns: Object.keys(imputedGeneral[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: imputedGeneral})
        }
    }, [incompleteFullGeneral, imputedGeneral])

    const fetchIncompleteFullGeneral = () => {
        fetch('http://localhost:8000/getIncompleteDfNewGeneral')
            .then((response) => response.json())
            .then((json) => {
                setIncompleteFullGeneral(json)
            })
            .catch((error) => console.log(error));
    }

    const fetchNormalizedIncompleteFullGeneral = () => {
        fetch('http://localhost:8000/getNormalizedIncompleteDfNewGeneral')
            .then((response) => response.json())
            .then((json) => {
                setIncompleteFullGeneral(json)
            })
            .catch((error) => console.log(error));
    }

    const performImputationGeneralNormalized = () => {
        axios
            .post("http://localhost:8000/performImputationGeneralNormalized", JSON.stringify(selectedMethod))
            .then((response) => {
                console.info(response);
                setImputedGeneral(response.data)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }
    const performImputationGeneralOriginal = () => {
        axios
            .post("http://localhost:8000/performImputationGeneralOriginal", JSON.stringify(selectedMethod))
            .then((response) => {
                console.info(response);
                setImputedGeneral(response.data)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }

    const mapCells = () =>{
        return incompleteData.rows.map((row, indexRow) => (
            <tr>
                {incompleteData.columns.map((column, indexCol) => (
                        <>
                            { (incompleteDataZeroesMarked.rows[indexRow][incompleteDataZeroesMarked.columns[indexCol].label] === true) ?
                                <td className="text-color-zero-imputation">{incompleteDataZeroesMarked[indexRow][incompleteDataZeroesMarked[indexCol].label]}</td>
                                :
                                <td className="text-color-non-zero-imputation">{incompleteDataZeroesMarked[indexRow][incompleteDataZeroesMarked[indexCol].label]}</td>
                            }
                        </>
                    )
                )}
            </tr>
        ))
    }

    return (
        <div className="container-perform-imputation">
            <div className="container-row-perform-imputation">
                <div className="statistics-options">
                    <div className="input-container-col">
                        <button onClick={fetchIncompleteFullGeneral} className="general-button">
                            View the original incomplete dataset
                        </button>
                        <button onClick={fetchNormalizedIncompleteFullGeneral} className="general-button">
                            View the normalized incomplete dataset
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    {(incompleteFullGeneral.length > 0) ?
                        <div className="table-position">
                            <div className="table-position-background">
                                <MDBTable scrollY maxHeight="400px">
                                    <MDBTableHead columns={incompleteData.columns}/>
                                    <MDBTableBody>
                                        {mapCells}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>
                        : null}
                </div>
            </div>

            <div className="container-row-perform-imputation">
                <div className="statistics-options">
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{filterForChoiceOfImputationMethod.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedMethod[filterForChoiceOfImputationMethod.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfImputationMethod.name, e.target.value, selectedMethod, setSelectedMethod)}
                        >
                            {filterForChoiceOfImputationMethod.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container-col">
                        <button onClick={performImputationGeneralOriginal} className="general-button">
                            View the original imputed dataset
                        </button>
                        <button onClick={performImputationGeneralNormalized} className="general-button">
                            View the normalized imputed dataset
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    {(imputedGeneral.length > 0) ?
                        <div className="table-position">
                            <div className="table-position-background">
                                <MDBTable scrollY maxHeight="400px">
                                    <MDBTableHead columns={imputedData.columns}/>
                                    <MDBTableBody rows={imputedData.rows} />
                                </MDBTable>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        </div>
    );
}
