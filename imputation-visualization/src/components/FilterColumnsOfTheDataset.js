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
    };
    const [tableData, setTableData] = useState( {
        columns: [],
        rows: []
    })
    const [tableVisible, setTableVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [stringOptions, setStringOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({
        id: "",
        class1: [],
        class2: [],
        other_columns: []
    });
    const prevOptions = useRef([]);

    function checkIfStringIsUnselected (string) {
        return ((!selectedOptions.class1.includes(string)) &&
            (!selectedOptions.class2.includes(string)) &&
            (!selectedOptions.other_columns.includes(string)))
    }

    useEffect(() => {
        let tempOptions = data.columns.map(column => (checkIfStringIsUnselected(column.label) ? {
            value: column.label, label: column.label
        } : {
            value: "", label: ""
        }));
        setOptions(tempOptions.filter(option => (option.label !== "" && option.value !== "")));

        let tempStringOptions = data.columns.map(column =>
            (checkIfStringIsUnselected(column.label) && (selectedOptions.id !== column.label)) ? column.label : ""
        )
        setStringOptions(tempStringOptions.filter(str => str !== ""));
    }, [data, selectedOptions])

    useEffect(() => {
        if(options.length > 0 && (!isEqual(options, prevOptions.current))){
            setSelectedOptions({...selectedOptions, id: options[0].label});
            prevOptions.current = options;
        }
    }, [options])

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
        if(validate()){
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

    return (
        <div className="table-filters">
            <div className="label-field-group-choose-dataset">
                <label className="label-statistics">Choose an ID column</label>
                <select className="input-for-statistics-ad-select"
                        value={selectedOptions.id}
                        required
                        onChange={(e) => handleOptionChange("id", e.target.value, selectedOptions, setSelectedOptions)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="label-field-group-choose-dataset">
                <label className="label-statistics">Columns for the first class</label>
                <Multiselect
                    showArrow
                    options={stringOptions}
                    isObject={false}
                    onSelect={onChangeMultiSelectFirstClass}
                    onRemove={onChangeMultiSelectFirstClass}
                />
            </div>
            <div className="label-field-group-choose-dataset">
                <label className="label-statistics">Columns for the second class</label>
                <Multiselect
                    showArrow
                    options={stringOptions}
                    isObject={false}
                    onSelect={onChangeMultiSelectSecondClass}
                    onRemove={onChangeMultiSelectSecondClass}
                />
            </div>
            <div className="label-field-group-choose-dataset">
                <label className="label-statistics">Other columns of interest</label>
                <Multiselect
                    showArrow
                    options={stringOptions}
                    isObject={false}
                    onSelect={onChangeMultiSelectOtherColumns}
                    onRemove={onChangeMultiSelectOtherColumns}
                />
            </div>
            {renderErrorMessage("filters_not_complete", errorMessages)}
            <button className="general-button" onClick={handleButtonClickViewTable}>View table</button>
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