import React, {useEffect, useState} from "react";
import axios from "axios";
import {Multiselect} from "multiselect-react-dropdown";
import {renderErrorMessage, sendRequestForPlot} from "../../utils/Utils";

export default function SecondPlot({ samplesFilter, errors, path }){

    const [errorMessages, setErrorMessages] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({
        samples: [],
        type_of_representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");
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
            setErrorMessages({name: "entries", message: errors.entries});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(validate()){
            sendRequestForPlot(path, selectedOptions, setImageUrl)
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
                    {renderErrorMessage("entries", errorMessages)}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
