import React, {useEffect, useState, useRef} from "react";
import {Link, Outlet} from "react-router-dom";
import "./ChooseDataset.css"
import {read, utils} from "xlsx";
import FilterColumnsOfTheDataset from "./FilterColumnsOfTheDataset";

function ChooseDataset(){

    const [incompleteDfNewProgeria, setIncompleteDfNewProgeria] = useState([]);
    const [incompleteDfNewAD, setIncompleteDfNewAD] = useState([])
    const [progeriaSelected, setProgeriaSelected] = useState(false);
    const [adSelected, setAdSelected] = useState(false);
    const [chooseDatasetSelected, setChooseDatasetSelected] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [data, setData] = useState( {
        columns: [],
        rows: []
    })
    const [importedData, setImportedData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [multipleSheets, setMultipleSheets] = useState(false);
    const [selectedSheet, setSelectedSheet] = useState(0);
    const [arrayOfExistingSheets, setArrayOfExistingSheets] = useState([]);
    const [confirmedSheetNr, setConfirmedSheetNr] = useState(false);

    // const resetState = () => {
    //     setTableData({columns: [], rows: []});
    //     setTableVisible(false);
    //     setSelectedOptions({id: "", class1: [], class2: [], other_columns: []});
    //     setSelectedValues([]);
    // }

    useEffect(() => {
        if(incompleteDfNewProgeria.length > 0 && progeriaSelected) {
            localStorage.setItem("selectedDisease", JSON.stringify("Progeria"));
            setData({...data, columns: Object.keys(incompleteDfNewProgeria[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: incompleteDfNewProgeria})
        }
       if(incompleteDfNewAD.length > 0 && adSelected) {
           localStorage.setItem("selectedDisease", JSON.stringify("Alzheimer's disease"));
           setData({...data, columns: Object.keys(incompleteDfNewAD[0]).map(key => {
                   return {
                       label: key, field: key, sort: 'asc'
                   };
               }), rows: incompleteDfNewAD
           })
       }
       if(importedData.length > 0 && chooseDatasetSelected) {
           setData({...data, columns: Object.keys(importedData[0]).map(key => {
               return {
                   label: key, field: key, sort: 'asc'
               };
           }), rows: importedData})
       }
    }, [incompleteDfNewProgeria, incompleteDfNewAD, progeriaSelected, adSelected, importedData, chooseDatasetSelected])

    const fetchIncompleteDfNewProgeria = () => {
        setProgeriaSelected(true);
        setAdSelected(false);
        setChooseDatasetSelected(false);
        setTrigger(true);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetProgeria')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewProgeria(json))
            .catch((error) => console.log(error));
    }

    const fetchIncompleteDfNewAD = () => {
        setProgeriaSelected(false);
        setAdSelected(true);
        setChooseDatasetSelected(false);
        setTrigger(true);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetAD')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewAD(json))
            .catch((error) => console.log(error));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
        // resetState()
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const newWb = read(event.target.result)
                setWb(newWb);
                const sheets = newWb.SheetNames;

                if (sheets.length > 1) {
                    setMultipleSheets(true)
                    setArrayOfExistingSheets(createArrayOfSheets(sheets.length))
                    setFileName(file.name)
                }else{
                    // resetState();
                    setMultipleSheets(false)
                    setConfirmedSheetNr(false)
                    const rows = utils.sheet_to_json(newWb.Sheets[sheets[0]])
                    setImportedData(rows)
                    setFileName(file.name)
                    setChooseDatasetSelected(true);
                    setAdSelected(false);
                    setProgeriaSelected(false);
                    setTrigger(true);
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleConfirmation = () => {
        // resetState()
        if(wb !== null){
            const sheets = wb.SheetNames;
            const rows = utils.sheet_to_json(wb.Sheets[sheets[selectedSheet]])
            setImportedData(rows)

            setConfirmedSheetNr(true);
            setChooseDatasetSelected(true);
            setAdSelected(false);
            setProgeriaSelected(false);
            setTrigger(true);
        }
    }

    const buttonClassNameProgeria = progeriaSelected ?  "disease-choice-button-selected" :  "disease-choice-button" ;
    const buttonClassNameAD = adSelected ?  "disease-choice-button-selected" :  "disease-choice-button" ;

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSheetChange = (value) => {
        setConfirmedSheetNr(false);
        setSelectedSheet(value);
    };

    const renderForm = (
        <form onSubmit = {handleSubmit}>
            <h2>Choose a dataset</h2>
            <div className="button-container-col">
                <div  className="button-container-row">
                    <div className="input-container-col">
                        <button onClick={fetchIncompleteDfNewProgeria} className={buttonClassNameProgeria}>Progeria dataset</button>
                    </div>
                    <div className="input-container-col">
                        <button onClick={fetchIncompleteDfNewAD} className={buttonClassNameAD} >Alzheimer's disease dataset</button>
                    </div>
                </div>
                <h2 className="h2-without-space">or import a dataset</h2>
                <div>
                    <button className="general-button" onClick={handleButtonClick}>Choose File</button>
                    <input type="file" name="file" className="custom-file-input" id="inputGroupFile" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport}
                           accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    {fileName && <p className="file-name">Selected file: {fileName}</p>}
                </div>
                {multipleSheets ?
                    <div>
                        <div className="label-field-group-with-space">
                            <label className="label-statistics">Choose a sheet</label>
                            <select className="input-for-statistics-ad-select"
                                    value={selectedSheet}
                                    required
                                    onChange={(e) => handleSheetChange(e.target.value)}
                            >
                                {arrayOfExistingSheets.map((nr) => (
                                    <option key={nr.value} value={nr.value}>
                                        {nr}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="general-button" onClick={handleConfirmation}>Confirm</button>
                    </div>
                    : null}
                {(!multipleSheets && (chooseDatasetSelected || progeriaSelected || adSelected)) || (multipleSheets && confirmedSheetNr) ?
                    <FilterColumnsOfTheDataset data = {data} trigger={trigger} setTrigger={setTrigger}/>
                    : null}
                <div className="button-container-row">
                    <div className="input-container-col">
                        <Link to="/">
                            <button className="general-button">Go back</button>
                        </Link>
                    </div>
                    <div className="input-container-col">
                        <Link to="/Statistics">
                            <input type="submit" value="Next"/>
                        </Link>
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

export default ChooseDataset;