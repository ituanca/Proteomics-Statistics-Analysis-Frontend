import React, {useEffect} from "react";

let data = JSON.parse(localStorage.getItem('selectedDataset'))
let filteredData = JSON.parse(localStorage.getItem('selectedOptions'))

let Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
let newIds = [...new Set(["-- Select an option --", ...Ids])];

export const generalOptions = [
    {name: "class", label: "Class", type: "select", values: ["All", "Class1", "Class2"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
];
export const entryOptions = [
    {name: "entry_id_1", label: "Entry ID 1", type: "select", values: newIds},
    {name: "entry_id_2", label: "Entry ID 2", type: "select", values: newIds},
    {name: "entry_id_3", label: "Entry ID 3", type: "select", values: newIds},
    {name: "entry_id_4", label: "Entry ID 4", type: "select", values: newIds},
    {name: "entry_id_5", label: "Entry ID 5", type: "select", values: newIds},
];

export const handleOptionChange = (option, value, selectedOptions, setSelectedOptions) => {
    setSelectedOptions({...selectedOptions, [option]: value});
};

export const validate = (enoughEntriesSelected, setErrorMessages, errors) => {
    if (!enoughEntriesSelected) {
        setErrorMessages({name: "entries", message: errors.entries});
    } else {
        setErrorMessages({});
        return true;
    }
    return false;
}

export const getTypeOfGroup = (option) => {
    if(option.name === "class" || option.name === "metric"){
        return "label-field-group-with-space"
    }
    return "label-field-group";
}


