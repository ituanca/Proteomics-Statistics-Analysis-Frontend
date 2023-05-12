import {useRef, useState} from "react";
import React, {useEffect} from "react";
import {handleOptionChange, renderErrorMessage} from "./Utils";
import {Multiselect} from "multiselect-react-dropdown";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import isEqual from 'lodash/isEqual';
import "./ChooseDataset.css"

export default function FilterColumnsOfTheDataset({data}) {

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        filters_not_complete: "You have to select an ID and at least one column for each of the first and second class",
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

    function checkIfStringIsUnselectedInMultiselect (string) {
        return ((!selectedOptions.class1.includes(string)) &&
            (!selectedOptions.class2.includes(string)) &&
            (!selectedOptions.other_columns.includes(string)))
    }

    useEffect(() => {
        setAvailableOptionsDropdown(data.columns.filter(column => checkIfStringIsUnselectedInMultiselect(column.label)))
        let tempAvailableOptionsString = data.columns.filter(column => checkIfStringIsUnselectedInMultiselect(column.label) && (!isEqual(selectedOptions.id, column.label)))
        setAvailableOptionsMultiselect(tempAvailableOptionsString.map(option => option.label))
    }, [data, selectedOptions])

    useEffect(() => {
        if(availableOptionsDropdown.length > 0 && (!isEqual(availableOptionsDropdown, prevOptions.current)) && selectedOptions.id === ""){
            setSelectedOptions({...selectedOptions, id: availableOptionsDropdown[0].label});
            prevOptions.current = availableOptionsDropdown;
        }
    }, [availableOptionsDropdown])

    console.log(data.rows[0])
    console.log(data.columns)

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
        if(selectedOptions.id === "" || selectedOptions.class1.length < 1 || selectedOptions.class2.length < 1){
            setErrorMessages({name: "filters_not_complete", message: errors.filters_not_complete});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleButtonClickViewTable = () => {
        if(validate() && validateClasses()){
            let selectedOptionsList = []
            selectedOptionsList.push(selectedOptions.id)
            selectedOptions.class1.map(element => {selectedOptionsList.push(element)})
            selectedOptions.class2.map(element => {selectedOptionsList.push(element)})
            selectedOptions.other_columns.map(element => {selectedOptionsList.push(element)})
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
    }

    localStorage.setItem("selectedDataset", JSON.stringify(tableData));

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

    return (
        <div>
            <div className="table-filters">
                <div className="label-field-group-choose-dataset">
                    <label className="label-statistics">Choose an ID column</label>
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
                <div className="label-field-group-choose-dataset">
                    <label className="label-statistics">Columns for the first class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectFirstClass}
                        onRemove={onChangeMultiSelectFirstClass}
                    />
                </div>
                <div className="label-field-group-choose-dataset">
                    <label className="label-statistics">Columns for the second class</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectSecondClass}
                        onRemove={onChangeMultiSelectSecondClass}
                    />
                </div>
                <div className="label-field-group-choose-dataset">
                    <label className="label-statistics">Other columns of interest</label>
                    <Multiselect
                        showArrow
                        options={availableOptionsMultiselect}
                        isObject={false}
                        onSelect={onChangeMultiSelectOtherColumns}
                        onRemove={onChangeMultiSelectOtherColumns}
                    />
                </div>
                {renderErrorMessage("filters_not_complete", errorMessages)}
                {renderErrorMessage("not_number", errorMessages)}
                <button className="general-button" onClick={handleButtonClickViewTable}>View table</button>
            </div>
            {(tableVisible) ?
            <div className="table-position">
                <MDBTable scrollY maxHeight="400px">
                    <MDBTableHead columns={tableData.columns}/>
                    <MDBTableBody rows={tableData.rows}/>
                </MDBTable>
            </div>
            : null}
        </div>
    )
}