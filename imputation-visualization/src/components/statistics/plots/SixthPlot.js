import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleOptionChange, sendRequestForPlot} from "../../utils/Utils";

export default function SixthPlot({ path, options}){

    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        type_of_representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [options[0].name]: options[0].values[0],
            [options[1].name]: options[1].values[0]
        });
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        sendRequestForPlot(path, selectedOptions, setImageUrl)
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics-options">
                    {options.map((option) => (
                        <div key={option.name} className="label-field-group-with-space">
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
                    ))}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
