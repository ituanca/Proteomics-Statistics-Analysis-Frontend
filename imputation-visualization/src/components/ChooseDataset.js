import React, {useEffect, useState, useRef} from "react";
import {Link, Outlet} from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import "./ChooseDataset.css"
import {read, utils} from "xlsx";
import {handleOptionChange, handleSingleOptionChange} from "./Utils";
import {Multiselect} from "multiselect-react-dropdown";

function ChooseDataset(){

    const [incompleteDfNewProgeria, setIncompleteDfNewProgeria] = useState([]);
    const [incompleteDfNewAD, setIncompleteDfNewAD] = useState([])
    const [progeriaSelected, setProgeriaSelected] = useState(false);
    const [adSelected, setAdSelected] = useState(false);
    const [chooseDatasetSelected, setChooseDatasetSelected] = useState(false);
    const [data, setData] = useState( {
        columns: [],
        rows: []
    })
    const [importedData, setImportedData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [options, setOptions] = useState([]);
    const [stringOptions, setStringOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({
        id: "",
        class1: [],
        class2: [],
        other_columns: []
    });

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
           setData({
               ...data, columns: Object.keys(incompleteDfNewAD[0]).map(key => {
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

    function checkIfStringIsUnselectedForStringOptions (string) {
        return (selectedOptions.id !== string && (!selectedOptions.class1.includes(string)) &&
            (!selectedOptions.class2.includes(string)) && (!selectedOptions.other_columns.includes(string)))
    }

    function checkIfStringIsUnselectedForOptions (string) {
        return ((!selectedOptions.class1.includes(string)) &&
            (!selectedOptions.class2.includes(string)) &&
            (!selectedOptions.other_columns.includes(string)))
    }

    useEffect(() => {
        let tempOptions = data.columns.map(column => (checkIfStringIsUnselectedForOptions(column.label) ? {
            value: column.label, label: column.label
        } : {
            value: "", label: ""
        }));
        setOptions(tempOptions.filter(option => (option.label !== "" && option.value !== "")));

        let tempStringOptions = data.columns.map(column => checkIfStringIsUnselectedForStringOptions(column.label) ? column.label : "")
        setStringOptions(tempStringOptions.filter(str => str !== ""));

    }, [data, selectedOptions])


    const fetchIncompleteDfNewProgeria = () => {
        setProgeriaSelected(true);
        setAdSelected(false);
        setChooseDatasetSelected(false);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetProgeria')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewProgeria(json))
            .catch((error) => console.log(error));
    }

    const fetchIncompleteDfNewAD = () => {
        setProgeriaSelected(false);
        setAdSelected(true);
        setChooseDatasetSelected(false);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetAD')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewAD(json))
            .catch((error) => console.log(error));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setImportedData(rows)
                    setFileName(file.name)
                }
            }
            reader.readAsArrayBuffer(file);
        }
        setChooseDatasetSelected(true);
        setAdSelected(false);
        setProgeriaSelected(false);
    }

    // localStorage.setItem("selectedDataset", JSON.stringify(data));

    const buttonClassNameProgeria = progeriaSelected ?  "disease-choice-button-selected" :  "disease-choice-button" ;
    const buttonClassNameAD = adSelected ?  "disease-choice-button-selected" :  "disease-choice-button" ;

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // console.log(importedData)
    // console.log(data.columns)
    // console.log(selectedOptions)

    const onChangeMultiSelectFirstClass = (selectedItems) => {
        setSelectedOptions({...selectedOptions, class1: selectedItems})
    };

    const onChangeMultiSelectSecondClass = (selectedItems) => {
        setSelectedOptions({...selectedOptions, class2: selectedItems})
    };

    const onChangeMultiSelectOtherColumns = (selectedItems) => {
        setSelectedOptions({...selectedOptions, other_columns: selectedItems})
    };

    // const [selectedOptions, setSelectedOptions] = useState({
    //     id: "",
    //     class1: [],
    //     class2: [],
    //     other_columns: []
    // });
    const [tableData, setTableData] = useState( {
        columns: [],
        rows: []
    })

    const [tableVisible, setTableVisible] = useState(false);

    const handleButtonClickViewTable = () => {
        // create a list with all the strings from the selectedOptions
        let selectedOptionsList = []
        selectedOptionsList.push(selectedOptions.id)
        selectedOptions.class1.map(element => {
            selectedOptionsList.push(element)
        })
        selectedOptions.class2.map(element => {
            selectedOptionsList.push(element)
        })
        selectedOptions.other_columns.map(element => {
            selectedOptionsList.push(element)
        })
        setTableData({
            columns: data.columns.filter(column => selectedOptionsList.includes(column.label)),
            rows: data.rows.map(row => {
                const newRow = {};
                selectedOptionsList.forEach(column => {
                    newRow[column] = row[column];
                });
                return newRow;
            })
        })
        setTableVisible(true);
    }

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
                <div className="label-field-group-with-space">
                    <label className="label-statistics">Choose an ID column</label>
                    <select className="input-for-statistics-ad-select"
                            value={selectedOptions.id}
                            onChange={(e) => handleOptionChange("id", e.target.value, selectedOptions, setSelectedOptions)}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="label-field-group-with-space">
                    <label className="label-statistics">Columns for the first class</label>
                    <Multiselect
                        showArrow
                        options={stringOptions}
                        isObject={false}
                        onSelect={onChangeMultiSelectFirstClass}
                        onRemove={onChangeMultiSelectFirstClass}
                    />
                </div>
                <div className="label-field-group-with-space">
                    <label className="label-statistics">Columns for the second class</label>
                    <Multiselect
                        showArrow
                        options={stringOptions}
                        isObject={false}
                        onSelect={onChangeMultiSelectSecondClass}
                        onRemove={onChangeMultiSelectSecondClass}
                    />
                </div>
                <div className="label-field-group-with-space">
                    <label className="label-statistics">Other columns of interest</label>
                    <Multiselect
                        showArrow
                        options={stringOptions}
                        isObject={false}
                        onSelect={onChangeMultiSelectOtherColumns}
                        onRemove={onChangeMultiSelectOtherColumns}
                    />
                </div>
                <button className="general-button" onClick={handleButtonClickViewTable}>View table</button>
                {(tableVisible) ?
                    <div className="table-position">
                        <MDBTable scrollY maxHeight="400px">
                            <MDBTableHead columns={tableData.columns}/>
                            <MDBTableBody rows={tableData.rows}/>
                        </MDBTable>
                    </div>
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