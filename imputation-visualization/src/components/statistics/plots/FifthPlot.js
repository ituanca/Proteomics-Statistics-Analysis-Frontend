import React, {useEffect, useState} from "react";
import axios from "axios";
import {labelAndDropdownGroupWithSpace, renderErrorMessage, sendRequestForPlot} from "../../utils/Utils";
import {truncateText, validate} from "../UtilsStatistics";

export default function FifthPlot({generalOptions, path, errors, selectedOptions, setSelectedOptions,
                                      limitForEnoughEntries, entryOptions, condForTypeOfGroup, handleOptionChange}){

    const [errorMessages, setErrorMessages] = useState({});
    // data has to be declared here, otherwise it doesn't update unless I refresh the page
    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    const [imageUrl, setImageUrl] = useState("");
    const [filterForChoiceOfImputationMethod, setFilterForChoiceOfImputationMethod] = useState({
        name: "imputation_method",
        label: "Choose the imputation method",
        type: "select",
        values: []
    });
    const [filterForChoiceOfImputationType, setFilterForChoiceOfImputationType] = useState({
        name: "type_of_imputation",
        label: "Choose the way to perform the imputation",
        type: "select",
        values: []
    });

    useEffect(() => {
        setSelectedOptions({
            ...selectedOptions,
            [generalOptions[0].name]: generalOptions[0].values[0],
            [generalOptions[1].name]: generalOptions[1].values[0],
            [generalOptions[2].name]: generalOptions[2].values[0],
            [filterForChoiceOfImputationMethod.name]: filterForChoiceOfImputationMethod.values[0],
            [filterForChoiceOfImputationType.name]: filterForChoiceOfImputationType.values[0]
        });
    }, [filterForChoiceOfImputationMethod, filterForChoiceOfImputationType]);

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
            })
            .catch((error) => console.log(error));
        fetch('http://localhost:8000/getImputationOptionsClass')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationType({...filterForChoiceOfImputationType, values: json});
            })
            .catch((error) => console.log(error));
    }, [])

    const nonEmptyFieldsCount = Object.values(selectedOptions).filter(value => value !== "").length;
    const enoughProteinsSelected = (nonEmptyFieldsCount >= limitForEnoughEntries)

    const validateTypeOfImputation = () => {
        if(selectedOptions.type_of_imputation === "separate" && (selectedOptionsForTable.class1.length < 3 || selectedOptionsForTable.class2.length < 3)){
            setErrorMessages({name: "separate_not_allowed", message: errors.separate_not_allowed});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate(enoughProteinsSelected, setErrorMessages, errors) && validateTypeOfImputation()){
            sendRequestForPlot(path, selectedOptions, setImageUrl)
        }
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
                                // disabled={!option.enabled}
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
                    {labelAndDropdownGroupWithSpace(generalOptions[1], selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(generalOptions[2], selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(filterForChoiceOfImputationMethod, selectedOptions, setSelectedOptions)}
                    {labelAndDropdownGroupWithSpace(filterForChoiceOfImputationType, selectedOptions, setSelectedOptions)}
                    {renderErrorMessage("entries", errorMessages)}
                    {renderErrorMessage("separate_not_allowed", errorMessages)}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
