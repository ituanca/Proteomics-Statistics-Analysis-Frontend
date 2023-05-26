import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {Multiselect} from "multiselect-react-dropdown";
import {getClassNameForColumnHeader} from "../Utils";
import LoadingSpinner from "../LoadingSpinner";
import GeneralStatisticsArtificialImputation from "./GeneralStatisticsArtificialImputation";


export default function StatisticsOnArtificialImputation({listOfImputedDataframes, markedData, imputationMethods}){

    const [tables, setTables] = useState([]);
    const [tablesDisplayed, setTablesDisplayed] = useState(false);
    const [buttonText, setButtonText] = useState("View all the imputed tables");
    const [keysOfTablesToBeDisplayed, setKeysOfTablesToBeDisplayed] = useState({
        tables: []
    });
    const [tablesToBeDisplayed, setTablesToBeDisplayed] = useState([]);
    const [statisticsDisplayed, setStatisticsDisplayed] = useState(false);

    const [oneTypeOfErrorClicked, setOneTypeOfErrorClicked] = useState(false);
    const [errors, setErrors] = useState([]);
    const [errorsForDisplay, setErrorsForDisplay] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [nameOfErrorMetric, setNameOfErrorMetric] = useState("");
    const [errorMetricsIds, setErrorMetricsIds] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [generalStatisticsDisplayed, setGeneralStatisticsDisplayed] = useState(false);

    useEffect( () => {
        let tempTables = [];
        Object.keys(listOfImputedDataframes).map((key) => {
            const value = listOfImputedDataframes[key]
            tempTables[key] = {
                columns: Object.keys(value[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: value
            }
        })
        setTables(tempTables)
        setTablesToBeDisplayed(tempTables)
    }, [])

    const handleViewTablesClick = () => {
        if(tablesDisplayed && buttonText === "Hide the imputed tables"){
            setTablesDisplayed(false);
            setButtonText("View all the imputed tables")
        }else{
            setTablesToBeDisplayed(tables)
            setTablesDisplayed(true);
            setButtonText("Hide the imputed tables")
        }
        setStatisticsDisplayed(false)
    }

    const handleViewSelectedTablesClick = () => {
        if(keysOfTablesToBeDisplayed.tables.length > 0){
            setButtonText("View all the imputed tables")
            setStatisticsDisplayed(false)
            setTablesDisplayed(true);
            let filteredTables = []
            Object.keys(tables).map((key) => {
                const value = tables[key];
                if(keysOfTablesToBeDisplayed.tables.includes(key)) {
                    filteredTables[key] = {
                        columns: value.columns,
                        rows: value.rows
                    }
                }})
            setTablesToBeDisplayed(filteredTables)
        }
    }

    const handleViewStatisticsClick = () => {
        setStatisticsDisplayed(true)
        setTablesDisplayed(false)
        setButtonText("View all the imputed tables")
        fetch('http://localhost:8000/getErrorMetrics')
            .then((response) => response.json())
            .then((json) => {
                setErrorMetricsIds(json)
            })
            .catch((error) => console.log(error));
        fetch('http://localhost:8000/getErrorsFromImputedTables')
            .then((response) => response.json())
            .then((json) => {
                let tempListOfErrors = [];
                Object.keys(json).map((imputationMethod) => {
                    let tempListOfMetrics = [];
                    Object.keys(json[imputationMethod]).map((errorMetric) => {
                        tempListOfMetrics[errorMetric] = json[imputationMethod][errorMetric]
                    })
                    tempListOfErrors[imputationMethod] = tempListOfMetrics
                })
                setErrors(tempListOfErrors)
                console.log(json)
            })
            .catch((error) => console.log(error));
    }

    function setCompleteName (id) {
        if(id === errorMetricsIds[0]) return "Mean Absolute Error"
        else if(id === errorMetricsIds[1]) return "Root Mean Square Error"
        else if(id === errorMetricsIds[2]) return "Mean Absolute Percentage Error"
    }

    useEffect(() => {
        if(errors !== [] && errorsForDisplay !== []){
            setIsLoading(false);
        }
    }, [errors, errorsForDisplay])

    const handleOneTypeOfErrorClick = (event, id) => {
        axios
            .post("http://localhost:8000/requestErrorsChartPerMethods", JSON.stringify(id), {
                responseType: "arraybuffer"
            })
            .then((response) => {
                console.info(response);
                setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
                setIsLoading(true);
                setNameOfErrorMetric(setCompleteName(id))
                setOneTypeOfErrorClicked(true)
                let tempErrors = [];
                Object.keys(errors).map((imputationMethod) => {
                    tempErrors[imputationMethod] = errors[imputationMethod][id]
                })
                setErrorsForDisplay(tempErrors)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }

    const handleAllTypesOfErrorClick = () => {
        console.log(errors)
        // axios
        //     .post("http://localhost:8000/requestErrorsChartForAllMethods", {
        //         responseType: "arraybuffer"
        //     })
        //     .then((response) => {
        //         console.info(response);
        //         setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
        //     })
        //     .catch((error) => {
        //         console.error("There was an error!", error.response.data.message)
        //     });
    }

    const handleViewGeneralStatisticsClick = () => {
        setGeneralStatisticsDisplayed(true)
        setTablesDisplayed(false)
        setButtonText("View all the imputed tables")
    }

    const onChangeMultiSelect = (selectedItems) => {
        setKeysOfTablesToBeDisplayed({...keysOfTablesToBeDisplayed, tables: selectedItems})
    }

    const mapCells = (rows, columns) => {
        return rows.map((row, indexRow) => (
            <tr key={indexRow}>
                {columns.map((column, indexCol) => (
                        <React.Fragment key={indexCol}>
                            {(markedData.rows[indexRow][column.label] === true) ?
                                <td className="text-color-zero-imputation">{rows[indexRow][column.label]}</td>
                                :
                                <td className="text-color-non-zero-imputation">{rows[indexRow][column.label]}</td>}
                        </React.Fragment>
                    )
                )}
            </tr>
        ))
    }

    return (
        <>
            <div className="input-container-row-less-space container-statistics-buttons-ai">
                <div className="button-in-row">
                    <button className="general-button button-statistics-ai" onClick={handleViewTablesClick}>
                        {buttonText}
                    </button>
                </div>
                <div className="input-container-col-less-space">
                    <div className="label-multiselect-group-choose-dataset">
                        <label className="label-choose-dataset">Columns for the first class</label>
                        <Multiselect
                            showArrow
                            options={imputationMethods}
                            isObject={false}
                            onSelect={onChangeMultiSelect}
                            onRemove={onChangeMultiSelect}
                        />
                    </div>
                    <button className="general-button button-select-methods-statistics-ai" onClick={handleViewSelectedTablesClick}>
                        View only the selected tables
                    </button>
                </div>
                <div className="button-in-row">
                    <button className="general-button button-statistics-ai" onClick={handleViewStatisticsClick}>
                        View statistics for the current situation
                    </button>
                </div>
                <div className="button-in-row">
                    <button className="general-button button-statistics-ai" onClick={handleViewGeneralStatisticsClick}>
                        View more general statistics
                    </button>
                </div>
            </div>
            {tablesDisplayed ?
                <>
                    {Object.keys(tablesToBeDisplayed).map((key) => {
                        const table = tablesToBeDisplayed[key];
                        const columns = table.columns;
                        const rows = table.rows;
                        return (
                            <div className="table-position">
                                <div className="label-table-description-container">
                                    <label className="label-table-description">{key}</label>
                                </div>
                                <div className="table-position-background">
                                    <MDBTable scrollY maxHeight="400px">
                                        <MDBTableHead>
                                            <tr>
                                                {columns.map((columnHeader, index) => (
                                                    <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                                ))}
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            {mapCells(rows, columns)}
                                        </MDBTableBody>
                                    </MDBTable>
                                </div>
                            </div>
                        );
                    })}
                </>
                : null}
            { statisticsDisplayed &&
                <div className="container-statistics-ai row">
                    <div className="statistics-view-errors">
                        <div className="button-in-col">
                            <button className="general-button errors-button"
                                    onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[0])}>Mean Absolute Error</button>
                        </div>
                        <div className="button-in-col">
                            <button className="general-button errors-button"
                                    onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[1])}>Root Mean Squared Error</button>
                        </div>
                        <div className="button-in-col">
                            <button className="general-button errors-button"
                                    onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[2])}>Mean Absolute Percentage Error</button>
                        </div>
                        <div className="button-in-col">
                            <button className="general-button errors-button" onClick={handleAllTypesOfErrorClick}>All error metrics</button>
                        </div>
                    </div>
                    { isLoading ? <LoadingSpinner /> : null}
                    { oneTypeOfErrorClicked && Object.keys(errorsForDisplay) !== [] && (!isLoading) &&
                        <div className="statistics-view-errors">
                            <h4> {nameOfErrorMetric} </h4>
                            <ul>
                                {Object.keys(errorsForDisplay).map((key) =>
                                    <li className="list-item-errors">
                                        <div className="left-part"><strong>{key}:</strong></div>
                                        <div className="right-part">{errorsForDisplay[key]}</div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                    { oneTypeOfErrorClicked && imageUrl !== "" && (!isLoading) &&
                        <img src={imageUrl} alt="My Plot"/>
                    }
                </div>
               }
            { generalStatisticsDisplayed &&
                <GeneralStatisticsArtificialImputation/>
            }
        </>
    );
}
