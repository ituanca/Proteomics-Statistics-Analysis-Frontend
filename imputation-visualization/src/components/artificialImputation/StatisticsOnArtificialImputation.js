import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {Multiselect} from "multiselect-react-dropdown";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../Utils";
import {truncateText} from "../uploadDataset/FunctionsForEntrySelectionPlot";


export default function StatisticsOnArtificialImputation({listOfImputedDataframes, markedData, imputationMethods}){

    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))
    const [tables, setTables] = useState([]);
    const [tablesDisplayed, setTablesDisplayed] = useState(true);
    const [keysOfTablesToBeDisplayed, setKeysOfTablesToBeDisplayed] = useState({
        tables: []
    });
    const [tablesToBeDisplayed, setTablesToBeDisplayed] = useState([]);
    const [statisticsDisplayed, setStatisticsDisplayed] = useState(false);
    const [viewErrorsClicked, setViewErrorsClicked] = useState(false);
    const [errors, setErrors] = useState([]);
    const [errorsForDisplay, setErrorsForDisplay] = useState([]);

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

    const [buttonText, setButtonText] = useState("Hide all the imputed tables");

    const handleViewTablesClick = () => {
        if(tablesDisplayed){
            setTablesDisplayed(false);
            setButtonText("View all the imputed tables")
        }else{
            setTablesDisplayed(true);
            setButtonText("Hide the imputed tables")
        }
    }

    const handleViewSelectedTablesClick = () => {
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
        console.log(filteredTables)
        setTablesToBeDisplayed(filteredTables)
    }

    const handleViewStatisticsClick = () => {
        setStatisticsDisplayed(true)
        setTablesDisplayed(false)
        setButtonText("View all the imputed tables")
    }

    useEffect( () => {
        if(viewErrorsClicked){
            let tempErrors = [];
            Object.keys(errors).map((key) => {
                tempErrors[key] = errors[key]
            })
            setErrorsForDisplay(tempErrors)
        }
    }, [errors, viewErrorsClicked])

    console.log(errors)

    const handleViewErrorsStatisticsClick = () => {
        fetch('http://localhost:8000/getErrorsFromImputedTables')
            .then((response) => response.json())
            .then((json) => {
                setErrors(json)
                setViewErrorsClicked(true)
                console.log(json)
            })
            .catch((error) => console.log(error));
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
            <div className="input-container-row-less-space">
                <div className="button-in-row">
                    <button className="general-button" onClick={handleViewTablesClick}>
                        {buttonText}
                    </button>
                </div>
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
                <div className="button-in-row">
                    <button className="general-button" onClick={handleViewSelectedTablesClick}>
                        View only the selected tables
                    </button>
                </div>
                <div className="button-in-row">
                    <button className="general-button" onClick={handleViewStatisticsClick}>
                        View statistics
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
            {statisticsDisplayed &&
                <div className="container-row">
                    <div className="container-col-with-background">
                        <div className="statistics-view-errors">
                            <button className="general-button" onClick={handleViewErrorsStatisticsClick}>
                                View errors
                            </button>
                        </div>
                    </div>
                    {viewErrorsClicked &&
                        <div className="container-col-with-background">
                            <div className="statistics-view-errors">
                                <ul>
                                    {Object.keys(errorsForDisplay).map((key) =>
                                        <li className="list-item-errors">
                                            <div className="left-part"><strong>{key}:</strong></div>
                                            <div className="right-part">{errorsForDisplay[key]}</div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    }
                </div>
               }
        </>
    );
}
