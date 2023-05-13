import React from "react";
import {handleOptionChange, generalOptions, getTypeOfGroup, entryOptions, validate} from "./FunctionsForEntrySelectionPlot";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../Utils";
import {useEffect, useState} from "react";
import axios from "axios";

export default function StatisticsOtherFirstPlot(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        entries: "select at least 2 entries",
    };
    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        entry_id_1: "",
        entry_id_2: "",
        entry_id_3: "",
        entry_id_4: "",
        entry_id_5: "",
        metric: "",
        type_of_plot: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [generalOptions[0].name]: generalOptions[0].values[0],
            [generalOptions[1].name]: generalOptions[1].values[0],
            [generalOptions[2].name]: generalOptions[2].values[0]
        });
    }, [])

    const nonEmptyFieldsCount = Object.values(selectedOptions).filter(value => value !== "").length;
    const enoughProteinsSelected = (nonEmptyFieldsCount >= 7)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate(enoughProteinsSelected, setErrorMessages, errors)){
            axios
                .post("http://localhost:8000/requestGeneralFirstChart", JSON.stringify(selectedOptions), {
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
                    {labelAndDropdownGroupWithSpace(generalOptions[0], selectedOptions, setSelectedOptions)}
                    {entryOptions.map((option) =>
                        <div key={option.name} className={getTypeOfGroup(option)}>
                            <label className="label-statistics">{option.label}</label>
                            <select className="input-for-statistics-ad-select"
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
