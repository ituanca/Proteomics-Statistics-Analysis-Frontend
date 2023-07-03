import {useRef, useState} from "react";
import React, {useEffect} from "react";
import {handleOptionChange, renderErrorMessage} from "../utils/Utils";
import {Multiselect} from "multiselect-react-dropdown";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import isEqual from 'lodash/isEqual';
import "./ChooseDataset.css"
import {Link} from "react-router-dom";
import axios from "axios";
import {read, utils} from "xlsx";

export default function FilterColumnsOfTheDataset({data, selectedDisease}) {

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        filters_not_complete: "You have to select an ID and at least 2 columns for each of the first and second class",
        filters_not_complete_without_id: "You have to select at least 2 columns for each of the first and second class",
        not_number: "The columns you select for the 2 classes have to contain numerical values",
        empty_id: "The column selected for ID must not contain empty values",
        duplicated_id: "The column selected for ID must not contain duplicates"
    };
    const [tableData, setTableData] = useState( {
        columns: [],
        rows: []
    })
    const [tableVisible, setTableVisible] = useState(false);
    const [availableOptionsDropdown, setAvailableOptionsDropdown] = useState([]);
    const [availableOptionsMultiselect, setAvailableOptionsMultiselect] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({
        id: "",
        class1: [],
        class2: [],
        other_columns: []
    });
    const prevOptions = useRef([]);

    const [availableEntries, setAvailableEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState({
        entries: []
    });
    const [numberOfRowsInTable, setNumberOfRowsInTable] = useState(0);

    // const [fileName, setFileName] = useState('');
    // const [multipleSheets, setMultipleSheets] = useState(false);
    // const [selectedSheet, setSelectedSheet] = useState(0);
    // const [arrayOfExistingSheets, setArrayOfExistingSheets] = useState([]);
    // const [confirmedSheetNr, setConfirmedSheetNr] = useState(false);
    // const [dataChanged, setDataChanged] = useState(false);
    // const [smthSelected, setSmthSelected] = useState(false);
    // const [importedEntriesID, setImportedEntriesID] = useState([]);
    // const [importedData, setImportedData] = useState([]);

    // useEffect(() => {
    //     if(JSON.parse(localStorage.getItem('chooseDatasetCompleted'))){
    //         setTableVisible(true)
    //         setTableData(JSON.parse(localStorage.getItem('selectedDataset')))
    //         setNumberOfRowsInTable(JSON.parse(localStorage.getItem('selectedDataset')).rows.length)
    //         console.log("cewfw", JSON.parse(localStorage.getItem('selectedDataset')))
    //         setSelectedOptions(JSON.parse(localStorage.getItem('selectedOptions')))
    //     }
    // },[])

    // set the available entries - all the IDs
    useEffect(() => {
        if(tableVisible && tableData.rows.length > 0 && tableData.columns.length > 0){
            let idColumn = data.columns.find(column => column.label === selectedOptions.id)
            if(idColumn !== {}){
                let idValues = tableData.rows.map(row => row[idColumn.label])
                setAvailableEntries(idValues)
            }
        }
    }, [tableVisible])

    function checkIfStringIsUnselectedInMultiselect (string) {
        return ((!selectedOptions.class1.includes(string)) &&
            (!selectedOptions.class2.includes(string)) &&
            (!selectedOptions.other_columns.includes(string)))
    }

    useEffect(() => {
        if(selectedDisease !== "Other"){
            setSelectedOptions({...selectedOptions, id: "Majority.protein.IDs"});
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
        setAvailableOptionsDropdown(data.columns.filter(column => checkIfStringIsUnselectedInMultiselect(column.label)))
        let tempAvailableOptionsString = data.columns.filter(column => checkIfStringIsUnselectedInMultiselect(column.label) && (!isEqual(selectedOptions.id, column.label)))
        setAvailableOptionsMultiselect(tempAvailableOptionsString.map(option => option.label))
    }, [data, selectedOptions])

    // initialize the ID field with the first value
    useEffect(() => {
        if(selectedDisease === "Other") {
            if (availableOptionsDropdown.length > 0 && (!isEqual(availableOptionsDropdown, prevOptions.current)) && selectedOptions.id === "") {
                setSelectedOptions({...selectedOptions, id: availableOptionsDropdown[0].label});
                prevOptions.current = availableOptionsDropdown;
            }
        }
    }, [availableOptionsDropdown])

    useEffect(() => {
        localStorage.setItem("selectedDataset", JSON.stringify(tableData));
        setNumberOfRowsInTable(tableData.rows.length)
    }, [tableData])

    const validateClasses = () => {
        for(let j = 0; j < selectedOptions.class1.length; j++){
            for(let i = 0; i < data.rows.length; i++){
                if(isNaN(data.rows[i][selectedOptions.class1[j]]) && (!isEqual(data.rows[i][selectedOptions.class1[j]], ''))){
                    setErrorMessages({name: "not_number", message: errors.not_number});
                    return false;
                }
            }
        }
        for(let j = 0; j < selectedOptions.class2.length; j++){
            for(let i = 0; i < data.rows.length; i++){
                if(isNaN(data.rows[i][selectedOptions.class2[j]]) && (!isEqual(data.rows[i][selectedOptions.class2[j]], ''))){
                    setErrorMessages({name: "not_number", message: errors.not_number});
                    return false;
                }
            }
        }
        return true;
    }

    const validateIdAndFiltersCompleteness = () => {
        if(selectedOptions.id === "" || selectedOptions.class1.length < 2 || selectedOptions.class2.length < 2){
            setErrorMessages({name: "filters_not_complete", message: errors.filters_not_complete});
            return false;
        } else {
            const valuesId = [];
            for(let i = 0; i < data.rows.length; i++){
                valuesId.push(data.rows[i][selectedOptions.id])
                if(isEqual(data.rows[i][selectedOptions.id],'')){
                    setErrorMessages({name: "empty_id", message: errors.empty_id});
                    return false;
                }
            }
            const duplicates = valuesId.filter((item, index) => valuesId.indexOf(item) !== index)
            if(duplicates.length > 0){
                setErrorMessages({name: "duplicated_id", message: errors.duplicated_id});
                return false;
            }
        }
        setErrorMessages({});
        return true;
    }

    const validateFiltersCompleteness = () => {
        if(selectedOptions.class1.length < 2 || selectedOptions.class2.length < 2){
            setErrorMessages({name: "filters_not_complete_without_id", message: errors.filters_not_complete_without_id});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    // const [filtersSent, setFiltersSent] = useState(false);
    //
    // useEffect(() => {
    //     if(filtersSent){
    //         fetch('http://localhost:8000/getIncompleteDfNewGeneral')
    //             .then((response) => response.json())
    //             .then((json) => {
    //                 setTableData({
    //                     ...tableData, columns: Object.keys(json[0]).map(key => {
    //                         return {
    //                             label: key, field: key, sort: 'asc'
    //                         };
    //                     }), rows: json
    //                 })
    //                 setFiltersSent(false);
    //                 setTableVisible(true);
    //                 localStorage.setItem("tableVisible", JSON.stringify(tableVisible));
    //             })
    //             .catch((error) => console.log(error));
    //     }
    // }, [filtersSent])

    const handleButtonClickViewTable = () => {
        if( ((selectedDisease === "Other" && validateIdAndFiltersCompleteness()) ||
            (selectedDisease !== "Other" && validateFiltersCompleteness())) && validateClasses()){
            let optionsToBeSent = selectedOptions
            if(selectedDisease === "Alzheimer's disease" && (!optionsToBeSent.other_columns.includes("Protein.names"))){
                optionsToBeSent.other_columns.push("Protein.names")
            }
            axios
                .post("http://localhost:8000/sendSelectedOptionsForTable", JSON.stringify(optionsToBeSent))
                .then((response) => {
                    console.info(response);
                    setTableData({
                        ...tableData, columns: Object.keys(response.data[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: response.data
                    })
                    setTableVisible(true);
                    localStorage.setItem("tableVisible", JSON.stringify(tableVisible));
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    const onChangeMultiSelectFirstClass = (selectedItems) => {
        setSelectedOptions({...selectedOptions, class1: selectedItems})
    };
    const onChangeMultiSelectSecondClass = (selectedItems) => {
        setSelectedOptions({...selectedOptions, class2: selectedItems})
    };
    const onChangeMultiSelectOtherColumns = (selectedItems) => {
        setSelectedOptions({...selectedOptions, other_columns: selectedItems})
    };
    const handleOptionChange = (option, value, selectedOptions, setSelectedOptions) => {
        setSelectedOptions({...selectedOptions, [option]: value});
    };

    const [entriesToEliminateSent, setEntriesToEliminateSent] = useState(false);
    useEffect(() => {
        if(entriesToEliminateSent){
            fetch('http://localhost:8000/getIncompleteDfNewGeneral')
                .then((response) => response.json())
                .then((json) => {
                    setTableData({
                        ...tableData, columns: Object.keys(json[0]).map(key => {
                            return {
                                label: key, field: key, sort: 'asc'
                            };
                        }), rows: json
                    })
                    setEntriesToEliminateSent(false);
                })
                .catch((error) => console.log(error));
        }
    }, [entriesToEliminateSent])

    const handleEliminateEntriesButtonClick = () => {
        if(selectedEntries.entries.length > 0){
            console.log(selectedEntries)
            axios
                .post("http://localhost:8000/eliminateEntries", JSON.stringify(selectedEntries))
                .then((response) => {
                    console.info(response);
                    setEntriesToEliminateSent(true)
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    // useEffect(() => {
    //     if(importedData.length > 0){
    //         let importedColumns = Object.keys(importedData[0]);
    //         setSelectedEntries({...selectedEntries, entries: (importedData.map((object) => {
    //                 let missingFields = importedColumns.filter((column) => !(column in object))
    //                 let updatedObject = {...object};
    //                 missingFields.forEach((field) => {
    //                     updatedObject[field] = "";
    //                 })
    //                 return updatedObject;
    //             }))})
    //     }
    // }, [importedData])

    const onChangeMultiSelectEntries = (selectedItems) => {
        setSelectedEntries({...selectedEntries, entries: selectedItems})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    // function createArrayOfSheets (max) {
    //     const numbers = [];
    //     for(let i = 0; i < max; i++){
    //         numbers.push(i);
    //     }
    //     return numbers;
    // }
    //
    // const [wb, setWb] = useState({});
    // const handleImport = ($event) => {
    //     const files = $event.target.files;
    //     if (files.length) {
    //         const file = files[0];
    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             const newWb = read(event.target.result)
    //             setWb(newWb);
    //             const sheets = newWb.SheetNames;
    //             setFileName(file.name)
    //
    //             setConfirmedSheetNr(false)
    //             if (sheets.length > 1) {
    //                 setMultipleSheets(true)
    //                 setArrayOfExistingSheets(createArrayOfSheets(sheets.length))
    //             }else{
    //                 setMultipleSheets(false)
    //                 const rows = utils.sheet_to_json(newWb.Sheets[sheets[0]], {skipHeader: true})
    //                 setImportedData(rows)
    //             }
    //         }
    //         reader.readAsArrayBuffer(file);
    //     }
    // }
    //
    // const handleSheetChange = (value) => {
    //     setConfirmedSheetNr(false);
    //     setSelectedSheet(value);
    // };
    //
    // const handleConfirmation = () => {
    //     if(wb !== null){
    //         const sheets = wb.SheetNames;
    //         const rows = utils.sheet_to_json(wb.Sheets[sheets[selectedSheet]])
    //         setImportedEntriesID(rows)
    //
    //         setConfirmedSheetNr(true);
    //         setSmthSelected(true);
    //         setImportedData(rows)
    //     }
    // }

    // const fileInputRef = useRef(null);
    // const handleButtonClick = () => {
    //     fileInputRef.current.click();
    // };

    const getClassNameForColumnHeader = (columnHeader) => {
        if(selectedOptions.class1.includes(columnHeader.label)){
            return "column-header-class1"
        }else if(selectedOptions.class2.includes(columnHeader.label)){
            return "column-header-class2"
        }else if(selectedOptions.other_columns.includes(columnHeader.label)){
            return "column-header-other-columns";
        }else if(selectedOptions.id === columnHeader.label){
            return "column-header-id";
        }
        return "column-header-other-columns";
    }

    return (
        <form onSubmit = {handleSubmit}>
            <div className="table-filters container-perform-imputation">
                <div className="label-table-description-container">
                    <label className="label-table-description">Filter the dataset:</label>
                </div>
                {selectedDisease === "Other" ?
                    <div className="label-field-group-choose-dataset">
                        <label className="label-choose-dataset-black">Choose an ID column</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions.id}
                                required
                                onChange={(e) => handleOptionChange("id", e.target.value, selectedOptions, setSelectedOptions)}
                        >
                            {availableOptionsDropdown.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                :
                    <div>
                        <div>
                            <div className="label-field-group-choose-dataset">
                                <label className="label-choose-dataset-black">ID: </label>
                                <label className="label-choose-dataset-black"><strong>{selectedOptions.id}</strong></label>
                            </div>
                            <div className="label-field-group-choose-dataset">
                                <label className="label-choose-dataset-black">Name: </label>
                                <label className="label-choose-dataset-black"><strong>Protein.names</strong></label>
                            </div>
                        </div>
                        {selectedDisease === "Alzheimer's disease" ?
                            <div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset-black">Class 1: </label>
                                    <label className="label-choose-dataset-black"><strong>Female</strong></label>
                                </div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset-black">Class 2: </label>
                                    <label className="label-choose-dataset-black"><strong>Male</strong></label>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset-black">Class 1: </label>
                                    <label className="label-choose-dataset-black"><strong>With Progeria</strong></label>
                                </div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset-black">Class 2: </label>
                                    <label className="label-choose-dataset-black"><strong>Without Progeria</strong></label>
                                </div>
                            </div>
                        }
                    </div>
                }
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset-black">
                        <div>
                            Select at least 2 samples for each class, or 3 samples if you are going to perform separate imputation.
                            Additionally, you have the option to include other samples in the table, which may not be part of the
                            selected classes.
                        </div>
                    </label>
                </div>
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset-black">Columns for the first class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectFirstClass}
                        onRemove={onChangeMultiSelectFirstClass}
                    />
                </div>
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset-black">Columns for the second class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectSecondClass}
                        onRemove={onChangeMultiSelectSecondClass}
                    />
                </div>
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset-black">Other columns of interest</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectOtherColumns}
                        onRemove={onChangeMultiSelectOtherColumns}
                    />
                </div>
                {renderErrorMessage(selectedDisease === "Other" ? "filters_not_complete" : "filters_not_complete_without_id", errorMessages)}
                {renderErrorMessage("not_number", errorMessages)}
                {renderErrorMessage("empty_id", errorMessages)}
                {renderErrorMessage("duplicated_id", errorMessages)}
                <button className="general-button button-margin-top-bottom" onClick={handleButtonClickViewTable}>Update table</button>
            </div>
            {(tableVisible) ?
                <div>
                    <div className="table-position">
                        <div className="table-colors-legend">
                            <div className="legend-container-row"><div className='box id-color'/>ID</div>
                            <div className="legend-container-row"><div className='box class1-color'/>Class 1</div>
                            <div className="legend-container-row"><div className='box class2-color'/>Class 2</div>
                            <div className="legend-container-row"><div className='box other-columns-color'/>Other columns</div>
                        </div>
                        <div className="table-position-background">
                            <MDBTable scrollY maxHeight="500px">
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
                        <div className="table-nr-rows"><label>The table has {numberOfRowsInTable} rows</label></div>
                    </div>
                    <div className="label-multiselect-group-choose-dataset">
                        <label className="label-choose-dataset-white"><strong>Optional:</strong> Choose entries to be eliminated from dataset</label>
                        <Multiselect
                            showArrow
                            options={availableEntries}
                            isObject={false}
                            onSelect={onChangeMultiSelectEntries}
                            onRemove={onChangeMultiSelectEntries}
                        />
                        <button className="general-button eliminate-entries" onClick={handleEliminateEntriesButtonClick}>Eliminate selected entries</button>
                    </div>
                    {/*<div className="label-multiselect-group-choose-dataset">*/}
                    {/*    <div>*/}
                    {/*        <button className="general-button" onClick={handleButtonClick}>Choose File</button>*/}
                    {/*        <input type="file" name="file" className="custom-file-input" id="inputGroupFile" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport}*/}
                    {/*               accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>*/}
                    {/*        {fileName && <p className="file-name">Selected file: {fileName}</p>}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*{multipleSheets ?*/}
                    {/*    <div className="table-filters">*/}
                    {/*        <div className="label-field-group-choose-dataset">*/}
                    {/*            <label className="label-statistics">Choose a sheet</label>*/}
                    {/*            <select className="input-for-statistics-ad-select"*/}
                    {/*                    value={selectedSheet}*/}
                    {/*                    required*/}
                    {/*                    onChange={(e) => handleSheetChange(e.target.value)}*/}
                    {/*            >*/}
                    {/*                {arrayOfExistingSheets.map((nr, index) => (*/}
                    {/*                    <option key={index} value={nr.value}>*/}
                    {/*                        {nr}*/}
                    {/*                    </option>*/}
                    {/*                ))}*/}
                    {/*            </select>*/}
                    {/*        </div>*/}
                    {/*        <button className="general-button" onClick={handleConfirmation}>Confirm</button>*/}
                    {/*    </div>*/}
                    {/*    : null}*/}
                    <div className="input-container-row-less-space">
                        <div className="button-in-row">
                            <Link to="/Statistics">
                                <input type="submit" value="Simple imputation and statistics"/>
                            </Link>
                        </div>
                        <div className="button-in-row">
                            <Link to="/ArtificialImputation">
                                <input type="submit" value="Artificial imputation and statistics"/>
                            </Link>
                        </div>
                    </div>
                </div>
            : null}
        </form>
    )
}