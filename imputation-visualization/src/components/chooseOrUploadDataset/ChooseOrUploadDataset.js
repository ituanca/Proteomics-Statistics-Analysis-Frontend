import React, {useEffect, useState, useRef, useMemo} from "react";
import {Link, Outlet} from "react-router-dom";
import "./ChooseOrUploadDataset.css"
import {read, utils} from "xlsx";
import FilterColumnsOfTheDataset from "./FilterColumnsOfTheDataset";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";

function ChooseOrUploadDataset(){

    const [selectedDisease, setSelectedDisease] = useState("");
    const [smthSelected, setSmthSelected] = useState(false);
    const [data, setData] = useState( {
        columns: [],
        rows: []
    })
    const [tableData, setTableData] = useState( {
        columns: [],
        rows: []
    })
    const [importedData, setImportedData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [multipleSheets, setMultipleSheets] = useState(false);
    const [selectedSheet, setSelectedSheet] = useState(0);
    const [arrayOfExistingSheets, setArrayOfExistingSheets] = useState([]);
    const [confirmedSheetNr, setConfirmedSheetNr] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);
    const [preparedImportedData, setPreparedImportedData] = useState([]);

    // include "" in the fields corresponding to the Excel cells where there is nothing
    useEffect(() => {
        let selectedColumnsString = data.columns.map(column => column.label)
        setTableData({
            columns: data.columns,
            rows: data.rows.map(row => {
                const newRow = {};
                selectedColumnsString.forEach(column => {
                    if(row[column]=== undefined){
                        newRow[column] = ""
                    }else{
                        newRow[column] = row[column];
                    }
                });
                return newRow;
            })
        })
    }, [data])

    useEffect(() => {
        localStorage.setItem("selectedDisease", JSON.stringify(selectedDisease));
        if(preparedImportedData.length > 0) {
            // after I choose the dataset to import, it is automatically sent to the backend, then it is received back as a response
            axios
                .post("http://localhost:8000/sendImportedData", JSON.stringify(preparedImportedData))
                .then((response) => {
                    console.info(response);
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });

            setData({...data, columns: Object.keys(preparedImportedData[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: preparedImportedData})
            setDataChanged(true);
        }
    }, [selectedDisease, preparedImportedData])

    // include "" in the fields corresponding to the Excel cells where there is nothing, so importedData -> preparedImportedData
    useEffect(() => {
        if(importedData.length > 0){
            let importedColumns = Object.keys(importedData[0]);
            setPreparedImportedData(importedData.map((object) => {
                let missingFields = importedColumns.filter((column) => !(column in object))
                let updatedObject = {...object};
                missingFields.forEach((field) => {
                    updatedObject[field] = "";
                })
                return updatedObject;
            }))
        }
    }, [importedData])

    const fetchIncompleteDfNewProgeria = () => {
        setSelectedDisease("Progeria");
        setSmthSelected(true);
        setDataChanged(false);
        setMultipleSheets(false);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetProgeria')
            .then((response) => response.json())
            .then((json) => setImportedData(json))
            .catch((error) => console.log(error));
    }

    const fetchIncompleteDfNewAD = () => {
        setSelectedDisease("Alzheimer's disease");
        setSmthSelected(true);
        setDataChanged(false);
        setMultipleSheets(false);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetAD')
            .then((response) => response.json())
            .then((json) => setImportedData(json))
            .catch((error) => console.log(error));
    }

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    function createArrayOfSheets (max) {
        const numbers = [];
        for(let i = 0; i < max; i++){
            numbers.push(i);
        }
        return numbers;
    }

    const [wb, setWb] = useState({});
    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const newWb = read(event.target.result)
                setWb(newWb);
                const sheets = newWb.SheetNames;
                setFileName(file.name)

                setConfirmedSheetNr(false)
                setDataChanged(false);
                if (sheets.length > 1) {
                    setMultipleSheets(true)
                    setArrayOfExistingSheets(createArrayOfSheets(sheets.length))
                }else{
                    setMultipleSheets(false)
                    const rows = utils.sheet_to_json(newWb.Sheets[sheets[0]])
                    setImportedData(rows)
                    setSmthSelected(true);
                    setSelectedDisease("Other")
                }
            }
            reader.readAsArrayBuffer(file);
            fileInputRef.current.value = null;
        }
    }

    const handleSheetChange = (value) => {
        setConfirmedSheetNr(false);
        setSelectedSheet(value);
    };

    const handleConfirmation = () => {
        if(wb !== null){
            const sheets = wb.SheetNames;
            const rows = utils.sheet_to_json(wb.Sheets[sheets[selectedSheet]])
            setImportedData(rows)

            setConfirmedSheetNr(true);
            setSmthSelected(true);
            setSelectedDisease("Other")
        }
    }

    const buttonClassNameProgeria = (selectedDisease === "Progeria") ?  "disease-choice-button-selected" :  "disease-choice-button" ;
    const buttonClassNameAD = (selectedDisease === "Alzheimer's disease") ?  "disease-choice-button-selected" :  "disease-choice-button" ;
    const buttonClassNameChooseFile = (selectedDisease === "Other") ?  "general-button-selected" :  "general-button" ;

    const [condToDisplayFiltersSection, setCondToDisplayFiltersSection] = useState(false)
    useEffect(() => {
        setCondToDisplayFiltersSection((!multipleSheets && smthSelected && dataChanged) || (multipleSheets && confirmedSheetNr))
    }, [multipleSheets, smthSelected, dataChanged, confirmedSheetNr])

    const renderForm = (
            <div className="page-container">
                <div className="choose-dataset-container-row">
                    <div className="choose-dataset-container-col">
                        <h2 className="h2-without-space">Choose a dataset</h2>
                        <div className="input-container-col">
                            <button onClick={fetchIncompleteDfNewProgeria} className={buttonClassNameProgeria}>Progeria dataset</button>
                        </div>
                        <div className="input-container-col">
                            <button onClick={fetchIncompleteDfNewAD} className={buttonClassNameAD} >Alzheimer's disease dataset</button>
                        </div>
                    </div>
                    <div  className="choose-dataset-container-col">
                        <h2 className="h2-without-space">or import a dataset</h2>
                        <div>
                            <button className={buttonClassNameChooseFile} onClick={handleButtonClick}>Choose File</button>
                            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport}
                                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            {fileName && selectedDisease === "Other" && <p className="file-name">Selected file: {fileName}</p>}
                        </div>
                    </div>
                </div>
                {multipleSheets ?
                    <div className="table-filters">
                        <div className="label-field-group-choose-dataset">
                            <label className="label-statistics">Choose a sheet</label>
                            <select className="input-for-statistics-ad-select"
                                    value={selectedSheet}
                                    required
                                    onChange={(e) => handleSheetChange(e.target.value)}
                            >
                                {arrayOfExistingSheets.map((nr, index) => (
                                    <option key={index} value={nr.value}>
                                        {nr}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="general-button" onClick={handleConfirmation}>Confirm</button>
                    </div>
                    : null}
                {(condToDisplayFiltersSection) ?
                    (
                        <div>
                            <div className="label-table-description-container">
                                <label className="label-table-description">The first 100 rows of the dataset:</label>
                            </div>
                            <div className="table-position">
                                <div className="table-position-background">
                                    <MDBTable scrollY maxHeight="500px">
                                        <MDBTableHead columns={tableData.columns}/>
                                        <MDBTableBody rows={tableData.rows.slice(0,100)}/>
                                    </MDBTable>
                                </div>
                            </div>
                            <FilterColumnsOfTheDataset data = {data} selectedDisease={selectedDisease}/>
                        </div>
                    )
                : null}
                <div className="button-container-row">
                    <div className="input-container-col-less-space">
                        <Link to="/">
                            <button className="general-button">Go back</button>
                        </Link>
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

export default ChooseOrUploadDataset;