import React from "react";

const data = JSON.parse(localStorage.getItem('selectedDataset'))

export const Ids = [...new Set(data.rows.map((item) => item["Majority.protein.IDs"]))];
export const newIds = [...new Set(["-- Select an option --", ...Ids])];
export const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
export const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];
export const generalOptions = [
    {name: "gender", label: "Gender", type: "select", values: ["All", "Male", "Female"],},
    {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation", "variance"]},
    {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
];
export const proteinOptions = [
    {name: "protein_id_1", label: "Protein ID 1", type: "select", values: newIds},
    {name: "protein_name_1", label: "Protein Name 1", type: "select", values: newProteinNames},
    {name: "protein_id_2", label: "Protein ID 2", type: "select", values: newIds},
    {name: "protein_name_2", label: "Protein Name 2", type: "select", values: newProteinNames},
    {name: "protein_id_3", label: "Protein ID 3", type: "select", values: newIds},
    {name: "protein_name_3", label: "Protein Name 3", type: "select", values: newProteinNames},
    {name: "protein_id_4", label: "Protein ID 4", type: "select", values: newIds},
    {name: "protein_name_4", label: "Protein Name 4", type: "select", values: newProteinNames},
    {name: "protein_id_5", label: "Protein ID 5", type: "select", values: newIds},
    {name: "protein_name_5", label: "Protein Name 5", type: "select", values: newProteinNames}
];

function handleSelectionsCorrelation(option, value, crtId, crtName, selectedOptions, setSelectedOptions, options) {
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

export const handleOptionChange = (option, value, selectedOptions, setSelectedOptions, options) => {
    setSelectedOptions({...selectedOptions, [option]: value});
    handleSelectionsCorrelation(option, value, "protein_id_1", "protein_name_1", selectedOptions, setSelectedOptions, options);
    handleSelectionsCorrelation(option, value, "protein_id_2", "protein_name_2", selectedOptions, setSelectedOptions, options);
    handleSelectionsCorrelation(option, value, "protein_id_3", "protein_name_3", selectedOptions, setSelectedOptions, options);
    handleSelectionsCorrelation(option, value, "protein_id_4", "protein_name_4", selectedOptions, setSelectedOptions, options);
    handleSelectionsCorrelation(option, value, "protein_id_5", "protein_name_5", selectedOptions, setSelectedOptions, options);
};

export const validate = (enoughProteinsSelected, setErrorMessages, errors) => {
    if (!enoughProteinsSelected) {
        setErrorMessages({name: "proteins", message: errors.proteins});
    } else {
        setErrorMessages({});
        return true;
    }
    return false;
}

export const getTypeOfGroup = (option) => {
    if(option.name === "gender" || option.name === "protein_name_1" || option.name === "protein_name_2" || option.name === "protein_name_3"
        || option.name === "protein_name_4" || option.name === "protein_name_5" || option.name === "metric"){
        return "label-field-group-with-space"
    }
    return "label-field-group";
}

export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
}


