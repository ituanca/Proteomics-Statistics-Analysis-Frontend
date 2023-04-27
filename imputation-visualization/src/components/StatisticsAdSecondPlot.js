import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleOptionChange, handleSelectionsCorrelation, renderErrorMessage} from "./Utils";
import { MultiSelect } from 'primereact/multiselect';


export default function StatisticsAdSecondPlot({ data, options }){

    const [errorMessages, setErrorMessages] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({
        gender: "",
        samples: [],
        type_of_plot: ""
    });

    const [selectedSamples, setSelectedSamples] = useState();

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions, [options[0].name]: options[0].values[0],
            [options[2].name]: options[2].values[0]
        });
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)

        axios
                .post("http://localhost:8000/requestAdSecondChart", JSON.stringify(selectedOptions), {
                    responseType: "arraybuffer"
                })
                .then((response) => {
                    console.info(response);
                    setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });

    };

    const handleOptionChange = (option, value) => {
        setSelectedOptions({...selectedOptions, [option]: value});
    };

    const handleMultipleOptionChange = (option, target) => {
        const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
        setSelectedOptions({...selectedOptions, [option]: selectedValues});
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics_options">
                    <h3>View the number of missing values for each sample</h3>
                    {options.map((option) => (
                        <div key={option.name} className="label-field-group-with-space">
                            <label className="label-statistics">{option.label}</label>
                            {option.type === "select" ? (
                                <select className="input-for-statistics-ad-select"
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                >
                                    {option.values.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <MultiSelect value={selectedOptions[option.name]}
                                             onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                             options={option.values}
                                             optionLabel="name"
                                             placeholder="Select samples"
                                             maxSelectedLabels={32}
                                             className="w-full md:w-20rem" />
                            )}
                        </div>
                    ))}
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
