import React, {useEffect, useState} from "react";
import axios from "axios";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../Utils";
import {handleOptionChange, generalOptions, getTypeOfGroup,
    proteinOptions, truncateText, validate} from "./FunctionsForProteinsSelectionPlot";

export default function StatisticsAdFifthPlot(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        proteins: "select at least 1 protein",
    };
    const [selectedOptions, setSelectedOptions] = useState({
        gender: "",
        protein_id_1: "", protein_name_1: "",
        protein_id_2: "", protein_name_2: "",
        protein_id_3: "", protein_name_3: "",
        protein_id_4: "", protein_name_4: "",
        protein_id_5: "", protein_name_5: "",
        metric: "",
        type_of_plot: "",
        imputation_method: ""
    });
    const [imageUrl, setImageUrl] = useState("");
    const [filterForChoiceOfImputationMethod, setFilterForChoiceOfImputationMethod] = useState({
        name: "imputation_method",
        label: "Choose the imputation method",
        type: "select",
        values: []
    });

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
                setSelectedOptions({...selectedOptions,
                    [generalOptions[0].name]: generalOptions[0].values[0],
                    [generalOptions[1].name]: generalOptions[1].values[0],
                    [generalOptions[2].name]: generalOptions[2].values[0],
                    [filterForChoiceOfImputationMethod.name]: json[0]
                });
            })
            .catch((error) => console.log(error));
    }, [])

    const nonEmptyFieldsCount = Object.values(selectedOptions).filter(value => value !== "").length;
    const enoughProteinsSelected = (nonEmptyFieldsCount >= 6)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate(enoughProteinsSelected, setErrorMessages, errors)){
            axios
                .post("http://localhost:8000/requestAdProteinsComparisonChartBeforeAndAfterImputation", JSON.stringify(selectedOptions), {
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
                    {/*<h3>Compare up to 5 proteins according to a metric</h3>*/}
                    {labelAndDropdownGroupWithSpace(generalOptions[0], selectedOptions, setSelectedOptions, proteinOptions)}
                    {proteinOptions.map((option) =>
                            <div key={option.name} className={getTypeOfGroup(option)}>
                                <label className="label-statistics">{option.label}</label>
                                <select className="input-for-statistics-ad-select"
                                    // disabled={!option.enabled}
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions)}
                                >
                                    {option.values.map((value) => (
                                        <option key={value} value={value}>
                                            {truncateText(value, 60)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                    )}
                    {labelAndDropdownGroupWithSpace(generalOptions[1], selectedOptions, setSelectedOptions, proteinOptions)}
                    {labelAndDropdownGroupWithSpace(generalOptions[2], selectedOptions, setSelectedOptions, proteinOptions)}
                    {labelAndDropdownGroupWithSpace(filterForChoiceOfImputationMethod, selectedOptions, setSelectedOptions, proteinOptions)}
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
