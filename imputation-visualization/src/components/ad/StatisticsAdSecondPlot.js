import React, {useEffect, useState} from "react";
import axios from "axios";
import {Multiselect} from "multiselect-react-dropdown";
import './StatisticsAdSecondPlot.css';
import {renderErrorMessage} from "../Utils";

export default function StatisticsAdSecondPlot({ samplesFilter }){

    const [errorMessages, setErrorMessages] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({
        samples: [],
        type_of_representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");
    const errors = {
        proteins: "select at least 1 protein",
    };
    const filterForChoiceOfRepresentation = {
        name: "type_of_representation",
        label: "View as",
        type: "select",
        values: ["number", "percentage"]
    };

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [filterForChoiceOfRepresentation.name]: filterForChoiceOfRepresentation.values[0]
        });
    }, [])

    const validate = () => {
        if(selectedOptions.samples.length < 1){
            setErrorMessages({name: "proteins", message: errors.proteins});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(validate()){
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
        }
    };

    const onChangeMultiSelect = (selectedItems) => {
        setSelectedOptions({...selectedOptions, samples: selectedItems})
    };

    const handleOptionChange = (option, value) => {
        setSelectedOptions({...selectedOptions, [option]: value});
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics-options">
                    <h4>View the number of missing values for the selected samples</h4>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{samplesFilter.label}</label>
                        <Multiselect
                            showArrow
                            options={samplesFilter.values}
                            isObject={false}
                            onSelect={onChangeMultiSelect}
                            onRemove={onChangeMultiSelect}
                        />
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{filterForChoiceOfRepresentation.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[filterForChoiceOfRepresentation.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfRepresentation.name, e.target.value)}
                        >
                            {filterForChoiceOfRepresentation.values.map((value) => (
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
