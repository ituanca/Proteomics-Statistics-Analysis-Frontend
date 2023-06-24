import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {handleOptionChange, mapCellsToHighlightMissingData, renderErrorMessage} from "../utils/Utils";
import LoadingSpinner from "../utils/LoadingSpinner";

export default function ImputationExecution(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        separate_not_allowed: "The separate imputation cannot be performed! You can only choose the full option"
    };
    const [selectedMethod, setSelectedMethod] = useState({
        imputation_method: "",
        type_of_imputation: ""
    });
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))
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
    const [filterForChoiceOfImputationType, setFilterForChoiceOfImputationType] = useState({
        name: "type_of_imputation",
        label: "Choose the way to perform the imputation",
        type: "select",
        values: []
    });
    const [incompleteDataZeroesMarked, setIncompleteDataZeroesMarked] = useState( {
        columns: [],
        rows: []
    })
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSelectedMethod({...selectedMethod,
            imputation_method: filterForChoiceOfImputationMethod.values[0],
            type_of_imputation: filterForChoiceOfImputationType.values[0]});
    },[filterForChoiceOfImputationMethod, filterForChoiceOfImputationType])

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
            })
            .catch((error) => console.log(error));
        fetch('http://localhost:8000/getImputationOptionsClass')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationType({...filterForChoiceOfImputationType, values: json});
            })
            .catch((error) => console.log(error));
    }, [])

    useEffect( () => {
        if(incompleteData.rows.length > 0){
            for(let i = 0; i < incompleteData.rows.length; i++){
                for(let j = 0; j < incompleteData.columns.length; j++){
                    const crtCell = incompleteData.rows[i][incompleteData.columns[j].label]
                    if(parseInt(crtCell) === 0) {
                        setIncompleteDataZeroesMarked((prevState => {
                            const newState = {...prevState};
                            newState.rows[i][newState.columns[j].label] = true
                            return newState
                        }))
                    }else{
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

    useEffect(() => {
        if(incompleteFullGeneral.length > 0) {
            const tempIncompleteData = { columns: Object.keys(incompleteFullGeneral[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: incompleteFullGeneral}
            setIncompleteData(tempIncompleteData)
            const tempIncompleteDataZeroesMarked = JSON.parse(JSON.stringify(tempIncompleteData))
            setIncompleteDataZeroesMarked(tempIncompleteDataZeroesMarked)
        }
        if(imputedGeneral.length > 0) {
            const tempImputedData = { columns: Object.keys(imputedGeneral[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: imputedGeneral}
            setImputedData(tempImputedData)
            const tempImputedDataMarked = JSON.parse(JSON.stringify(tempImputedData))
            setIncompleteDataZeroesMarked(tempImputedDataMarked)
            setIsLoading(false);
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

    const validateTypeOfImputation = () => {
        if(selectedMethod.type_of_imputation === "separate" && (selectedOptionsForTable.class1.length < 3 || selectedOptionsForTable.class2.length < 3)){
            setErrorMessages({name: "separate_not_allowed", message: errors.separate_not_allowed});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const performImputationGeneralNormalized = () => {
        if(validateTypeOfImputation()) {
            setIsLoading(true)
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
    }

    const performImputationGeneralOriginal = () => {
        if(validateTypeOfImputation()) {
            setIsLoading(true)
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
                                    <MDBTableHead>
                                        <tr>
                                            {incompleteData.columns.map((columnHeader, index) => (
                                                <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                            ))}
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {mapCellsToHighlightMissingData(
                                            incompleteData.rows,
                                            incompleteData.columns,
                                            incompleteDataZeroesMarked)}
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
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{filterForChoiceOfImputationType.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedMethod[filterForChoiceOfImputationType.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfImputationType.name, e.target.value, selectedMethod, setSelectedMethod)}
                        >
                            {filterForChoiceOfImputationType.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    {renderErrorMessage("separate_not_allowed", errorMessages)}
                    <div className="input-container-col">
                        <button onClick={performImputationGeneralOriginal} className="general-button">
                            View the original imputed dataset
                        </button>
                        <button onClick={performImputationGeneralNormalized} className="general-button">
                            View the normalized imputed dataset
                        </button>
                    </div>
                </div>
                { isLoading ?
                    <LoadingSpinner />
                    :
                    <div className="table-container">
                        {(imputedGeneral.length > 0) ?
                            <div className="table-position">
                                <div className="table-position-background">
                                    <MDBTable scrollY maxHeight="400px">
                                        <MDBTableHead>
                                            <tr>
                                                {imputedData.columns.map((columnHeader, index) => (
                                                    <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                                ))}
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            {mapCellsToHighlightMissingData(
                                                imputedData.rows,
                                                imputedData.columns,
                                                incompleteDataZeroesMarked)}
                                        </MDBTableBody>
                                    </MDBTable>
                                </div>
                            </div>
                            : null}
                    </div>
                }
            </div>
        </div>
    );
}
