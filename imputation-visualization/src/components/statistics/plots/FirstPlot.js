import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../../utils/Utils";
import {truncateText, validate} from "../UtilsStatistics";
import {Multiselect} from "multiselect-react-dropdown";

export default function FirstPlot({errors, selectedOptions, setSelectedOptions, generalOptions,
                                  limitForEnoughEntries, path, entryOptions, condForTypeOfGroup, handleOptionChange}){

    const [errorMessages, setErrorMessages] = useState({});
    const data = JSON.parse(localStorage.getItem('selectedDataset'))

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [generalOptions[0].name]: generalOptions[0].values[0],
            [generalOptions[1].name]: generalOptions[1].values[0],
            [generalOptions[2].name]: generalOptions[2].values[0]
        });
    }, [])

    const nonEmptyFieldsCount = Object.values(selectedOptions).filter(value => value !== "").length;
    const enoughProteinsSelected = (nonEmptyFieldsCount >= limitForEnoughEntries)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate(enoughProteinsSelected, setErrorMessages, errors)){
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
        }
    };

    const onChangeMultiSelect = (selectedItems) => {
        setSelectedOptions({...selectedOptions, samples: selectedItems})
    };

    const getTypeOfGroup = (option) => {
        if(condForTypeOfGroup(option)){
            return "label-field-group-with-space"
        }
        return "label-field-group";
    }

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
                                    value={selectedOptions[option.name]}
                                    onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions, entryOptions, data)}
                            >
                                {option.values.map((value) => (
                                    <option key={value} value={value}>
                                        {truncateText(value, 60)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/*<Multiselect*/}
                    {/*    showArrow*/}
                    {/*    options={entryOptions.values}*/}
                    {/*    isObject={false}*/}
                    {/*    onSelect={onChangeMultiSelect}*/}
                    {/*    onRemove={onChangeMultiSelect}*/}
                    {/*/>*/}
                    {labelAndDropdownGroupWithSpace(generalOptions[1], selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(generalOptions[2], selectedOptions, setSelectedOptions)}
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
