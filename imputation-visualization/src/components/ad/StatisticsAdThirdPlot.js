import React, {useEffect, useState} from "react";
import axios from "axios";
import {renderErrorMessage} from "../Utils";
import './StatisticsAdSecondPlot.css';

export default function StatisticsAdThirdPlot({ data, genderFilter, typeOfPlotFilter }){

    const [errorMessages, setErrorMessages] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({
        gender: "",
        type_of_plot: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [genderFilter.name]: genderFilter.values[0],
            [typeOfPlotFilter.name]: typeOfPlotFilter.values[0]
        });
    }, [genderFilter, typeOfPlotFilter])

    console.log(selectedOptions)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)

        axios
            .post("http://localhost:8000/requestAdThirdChart", JSON.stringify(selectedOptions), {
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

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics_options">
                    <h4>View the number of missing values for each sample by gender</h4>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{genderFilter.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[genderFilter.name]}
                                onChange={(e) => handleOptionChange(genderFilter.name, e.target.value)}
                        >
                            {genderFilter.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{typeOfPlotFilter.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[typeOfPlotFilter.name]}
                                onChange={(e) => handleOptionChange(typeOfPlotFilter.name, e.target.value)}
                        >
                            {typeOfPlotFilter.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
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
