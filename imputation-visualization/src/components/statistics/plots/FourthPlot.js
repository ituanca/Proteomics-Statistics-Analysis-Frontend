import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleOptionChange} from "../../utils/Utils";

export default function FourthPlot({ path, filterForChoiceOfRepresentation}){

    const [selectedOptions, setSelectedOptions] = useState({
        type_of_representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [filterForChoiceOfRepresentation.name]: filterForChoiceOfRepresentation.values[0]
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
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{filterForChoiceOfRepresentation.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[filterForChoiceOfRepresentation.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfRepresentation.name, e.target.value, selectedOptions, setSelectedOptions)}
                        >
                            {filterForChoiceOfRepresentation.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
