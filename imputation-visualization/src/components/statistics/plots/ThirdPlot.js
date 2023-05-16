import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleOptionChange} from "../../Utils";

export default function ThirdPlot({options, path}){

    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        type_of_plot: "",
        representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [options[0].name]: options[0].values[0],
            [options[1].name]: options[1].values[0],
            [options[2].name]: options[2].values[0]
        });
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("http://localhost:8000/" + path, JSON.stringify(selectedOptions), {
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
