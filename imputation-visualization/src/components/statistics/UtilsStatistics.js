import React from "react";

export const generalOptions = [
    {name: "class", label: "Class", type: "select", values: ["All", "Class1", "Class2"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
];

export const generalOptionsProgeria = [
    {name: "class", label: "Class", type: "select", values: ["All", "With_Progeria", "Without_Progeria"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
];

export const generalOptionsAD = [
    {name: "class", label: "Gender", type: "select", values: ["All", "Male", "Female"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
];

export const optionsForThirdPlotAD = [
    {name: "class", label: "Gender", type: "select", values: ["All", "Male", "Female"]},
    {name: "representation", label: "View as", type: "select", values: ["number", "percentage"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["vertical bar chart", "horizontal bar chart"]}
];

export const optionsForThirdPlotProgeria = [
    {name: "class", label: "Class", type: "select", values: ["All", "With_Progeria", "Without_Progeria"]},
    {name: "representation", label: "View as", type: "select", values: ["number", "percentage"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["vertical bar chart", "horizontal bar chart"]}
];

export const handleOptionChange = (option, value, selectedOptions, setSelectedOptions) => {
    if(value !== "-- Select an option --") {
        setSelectedOptions({...selectedOptions, [option]: value});
    }else{
        setSelectedOptions({...selectedOptions, [option]: ""});
    }
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

function handleSelectionsCorrelation(option, value, crtId, crtName, selectedOptions, setSelectedOptions, options, data) {
    if(value !== "-- Select an option --"){
        if(option === crtId){
            const nameOption = options.find((option) => option.name === crtName)
            const correspondingName = data.rows.find((d) => d["Majority.protein.IDs"] === value)["Protein.names"];
            setSelectedOptions({ ...selectedOptions, [option]: value, [nameOption.name]: correspondingName });
        }else if(option === crtName){
            const idOption = options.find((option) => option.name === crtId)
            const correspondingId = data.rows.find((d) => d["Protein.names"] === value)["Majority.protein.IDs"];
            setSelectedOptions({...selectedOptions, [option]: value, [idOption.name]: correspondingId});
        }
    }else{
        if(option === crtId){
            const nameOption = options.find((option) => option.name === crtName)
            setSelectedOptions({ ...selectedOptions, [option]: "", [nameOption.name]: ""});
        }else if(option === crtName){
            const idOption = options.find((option) => option.name === crtId)
            setSelectedOptions({...selectedOptions, [option]: "", [idOption.name]: ""});
        }
    }
}

export const handleOptionChangeWithCorrelation = (option, value, selectedOptions, setSelectedOptions, options, data) => {
    setSelectedOptions({...selectedOptions, [option]: value});
    handleSelectionsCorrelation(option, value, "entry_id_1", "entry_name_1", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "entry_id_2", "entry_name_2", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "entry_id_3", "entry_name_3", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "entry_id_4", "entry_name_4", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "entry_id_5", "entry_name_5", selectedOptions, setSelectedOptions, options, data);
};

export function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength) + "...";
        }
}


