import {useRef, useState} from "react";
import React, {useEffect} from "react";
import {handleOptionChange, renderErrorMessage} from "../Utils";
import {Multiselect} from "multiselect-react-dropdown";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import isEqual from 'lodash/isEqual';
import "./ChooseDataset.css"
import {Link} from "react-router-dom";
import axios from "axios";

export default function FilterColumnsOfTheDataset({data, selectedDisease}) {

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        filters_not_complete: "You have to select an ID and at least 2 columns for each of the first and second class",
        filters_not_complete_without_id: "You have to select at least 2 columns for each of the first and second class",
        not_number: "The columns you select for the 2 classes have to contain numerical values"
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

    const validate = () => {
        if(selectedOptions.id === "" || selectedOptions.class1.length < 2 || selectedOptions.class2.length < 2){
            setErrorMessages({name: "filters_not_complete", message: errors.filters_not_complete});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const validateWithoutId = () => {
        if(selectedOptions.class1.length < 2 || selectedOptions.class2.length < 2){
            setErrorMessages({name: "filters_not_complete_without_id", message: errors.filters_not_complete_without_id});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const [filtersSent, setFiltersSent] = useState(false);

    useEffect(() => {
        if(filtersSent){
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
                    setFiltersSent(false);
                    setTableVisible(true);
                    localStorage.setItem("tableVisible", JSON.stringify(tableVisible));
                })
                .catch((error) => console.log(error));
        }
    }, [filtersSent])

    const handleButtonClickViewTable = () => {
        if( ((selectedDisease === "Other" && validate()) || (selectedDisease !== "Other" && validateWithoutId())) && validateClasses()){
            // let selectedOptionsList = []
            // selectedOptionsList.push(selectedOptions.id)
            // if(selectedDisease !== "Other"){
            //     selectedOptionsList.push("Protein.names")
            // }
            // selectedOptions.class1.map(element => {selectedOptionsList.push(element)})
            // selectedOptions.class2.map(element => {selectedOptionsList.push(element)})
            // selectedOptions.other_columns.map(element => {selectedOptionsList.push(element)})
            //
            // let selectedColumns = data.columns.filter(column => selectedOptionsList.includes(column.label))
            // let selectedColumnsString = selectedColumns.map(column => column.label)
            //
            // setTableData({
            //     columns: selectedColumns,  // coloanele se adauga in ordinea in care sunt trecute in data.columns
            //     rows: data.rows.map(row => {
            //         const newRow = {};
            //         selectedColumnsString.forEach(column => {
            //             if(row[column]=== undefined){
            //                 newRow[column] = ""
            //             }else{
            //                 newRow[column] = row[column];
            //             }
            //         });
            //         return newRow;
            //     })
            // })
            // setTableVisible(true);
            // localStorage.setItem("tableVisible", JSON.stringify(tableVisible));

            // send the filters for the dataset to the backend and receive them back as a response
            console.log(selectedOptions)
            axios
                .post("http://localhost:8000/sendSelectedOptionsForTable", JSON.stringify(selectedOptions))
                .then((response) => {
                    console.info(response);
                    setFiltersSent(true);
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

    const onChangeMultiSelectEntries = (selectedItems) => {
        setSelectedEntries({...selectedEntries, entries: selectedItems})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    };

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
            <div className="table-filters">
                <div className="label-table-description-container">
                    <label className="label-table-description">Filter the dataset:</label>
                </div>
                {selectedDisease === "Other" ?
                    <div className="label-field-group-choose-dataset">
                        <label className="label-choose-dataset">Choose an ID column</label>
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
                                <label className="label-choose-dataset">ID: </label>
                                <label className="label-choose-dataset"><strong>{selectedOptions.id}</strong></label>
                            </div>
                            <div className="label-field-group-choose-dataset">
                                <label className="label-choose-dataset">Name: </label>
                                <label className="label-choose-dataset"><strong>Protein.names</strong></label>
                            </div>
                        </div>
                        {selectedDisease === "Alzheimer's disease" ?
                            <div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset">Class 1: </label>
                                    <label className="label-choose-dataset"><strong>Female</strong></label>
                                </div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset">Class 2: </label>
                                    <label className="label-choose-dataset"><strong>Male</strong></label>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset">Class 1: </label>
                                    <label className="label-choose-dataset"><strong>With Progeria</strong></label>
                                </div>
                                <div className="label-field-group-choose-dataset">
                                    <label className="label-choose-dataset">Class 2: </label>
                                    <label className="label-choose-dataset"><strong>Without Progeria</strong></label>
                                </div>
                            </div>
                        }
                    </div>
                }
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset">Columns for the first class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectFirstClass}
                        onRemove={onChangeMultiSelectFirstClass}
                    />
                </div>
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset">Columns for the second class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectSecondClass}
                        onRemove={onChangeMultiSelectSecondClass}
                    />
                </div>
                <div className="label-multiselect-group-choose-dataset">
                    <label className="label-choose-dataset">Other columns of interest</label>
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
                <button className="general-button" onClick={handleButtonClickViewTable}>Update table</button>
            </div>
            {(tableVisible) ?
                <div>
                    <div className="table-colors-legend">
                        <div className="legend-container-row"><div className='box id-color'/>ID</div>
                        <div className="legend-container-row"><div className='box class1-color'/>Class 1</div>
                        <div className="legend-container-row"><div className='box class2-color'/>Class 2</div>
                        <div className="legend-container-row"><div className='box other-columns-color'/>Other columns</div>
                    </div>
                    <div className="table-position">
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
                    </div>
                    <div className="label-multiselect-group-choose-dataset">
                        <label className="label-choose-dataset"><strong>Optional:</strong> Choose entries to be eliminate from dataset</label>
                        <Multiselect
                            showArrow
                            options={availableEntries}
                            isObject={false}
                            onSelect={onChangeMultiSelectEntries}
                            onRemove={onChangeMultiSelectEntries}
                        />
                        <button className="general-button eliminate-entries" onClick={handleEliminateEntriesButtonClick}>Eliminate selected entries</button>
                    </div>

                    <div className="input-container-row-less-space">
                        <div className="button-in-row">
                            <Link to="/Statistics">
                                <input type="submit" value="Statistics on the filtered dataset"/>
                            </Link>
                        </div>
                        <div className="button-in-row">
                            <Link to="/ArtificialImputation">
                                <input type="submit" value="Artificial imputation"/>
                            </Link>
                        </div>
                    </div>

                </div>
            : null}
        </form>
    )
}