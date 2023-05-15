import React, {useEffect, useState} from "react";
import axios from "axios";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../Utils";
import {handleOptionChange, generalOptions, getTypeOfGroup, validate} from "./FunctionsForEntrySelectionPlot";

export default function StatisticsOtherFifthPlot(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        entries: "select at least 1 entry",
    };
    // data, filteredData, Ids, newIds and entryOptions have to be declared here, otherwise they don't update unless I refresh the page
    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const filteredData = JSON.parse(localStorage.getItem('selectedOptions'))
    const Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const entryOptions = [
        {name: "entry_id_1", label: "Entry ID 1", type: "select", values: newIds},
        {name: "entry_id_2", label: "Entry ID 2", type: "select", values: newIds},
        {name: "entry_id_3", label: "Entry ID 3", type: "select", values: newIds},
        {name: "entry_id_4", label: "Entry ID 4", type: "select", values: newIds},
        {name: "entry_id_5", label: "Entry ID 5", type: "select", values: newIds},
    ];
    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        entry_id_1: "",
        entry_id_2: "",
        entry_id_3: "",
        entry_id_4: "",
        entry_id_5: "",
        metric: "",
        type_of_plot: "",
        imputation_method: ""
    });
    const [imageUrl, setImageUrl] = useState("");
    const [filterForChoiceOfImputationMethod, setFilterForChoiceOfImputationMethod] = useState({
        name: "imputation_method",
        label: "Choose the imputation method",
        type: "select",
        values: []
    });

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
                setSelectedOptions({...selectedOptions,
                    [generalOptions[0].name]: generalOptions[0].values[0],
                    [generalOptions[1].name]: generalOptions[1].values[0],
                    [generalOptions[2].name]: generalOptions[2].values[0],
                    [filterForChoiceOfImputationMethod.name]: json[0]
                });
            })
            .catch((error) => console.log(error));
    }, [])

    const nonEmptyFieldsCount = Object.values(selectedOptions).filter(value => value !== "").length;
    const enoughProteinsSelected = (nonEmptyFieldsCount >= 5)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate(enoughProteinsSelected, setErrorMessages, errors)){
            axios
                .post("http://localhost:8000/requestGeneralFifthChart", JSON.stringify(selectedOptions), {
                    responseType: "arraybuffer"
                })
                .then((response) => {
                    console.info(response);
                    setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics-options">
                    {/*<h3>Compare up to 5 proteins according to a metric</h3>*/}
                    {labelAndDropdownGroupWithSpace(generalOptions[0], selectedOptions, setSelectedOptions)}
                    {entryOptions.map((option) =>
                        <div key={option.name} className={getTypeOfGroup(option)}>
                            <label className="label-statistics">{option.label}</label>
                            <select className="input-for-statistics-ad-select"
                                // disabled={!option.enabled}
                                    value={selectedOptions[option.name]}
                                    onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions)}
                            >
                                {option.values.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {labelAndDropdownGroupWithSpace(generalOptions[1], selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(generalOptions[2], selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(filterForChoiceOfImputationMethod, selectedOptions, setSelectedOptions)}
                    {renderErrorMessage("proteins", errorMessages)}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
