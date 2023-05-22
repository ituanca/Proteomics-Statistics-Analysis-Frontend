import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";


export default function StatisticsOnArtificialImputation({listOfImputedDataframes, markedData}){

    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    const [tables, setTables] = useState([]);
    const [tablesDisplayed, setTablesDisplayed] = useState(true);

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

    const [buttonText, setButtonText] = useState("Hide the imputed tables");

    const handleViewTablesClick = () => {
        if(tablesDisplayed){
            setTablesDisplayed(false);
            setButtonText("View the imputed tables")
        }else{
            setTablesDisplayed(true);
            setButtonText("Hide the imputed tables")
        }
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
                <div className="button-in-row">
                    <button className="general-button" >
                        View the statistics
                    </button>
                </div>
            </div>
            {tablesDisplayed ?
                <>
                    {Object.keys(tables).map((key) => {
                        const table = tables[key];
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
        </>
    );
}
