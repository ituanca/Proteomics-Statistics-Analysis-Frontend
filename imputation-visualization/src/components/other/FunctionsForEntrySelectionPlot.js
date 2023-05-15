import React from "react";

export const generalOptions = [
    {name: "class", label: "Class", type: "select", values: ["All", "Class1", "Class2"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
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


