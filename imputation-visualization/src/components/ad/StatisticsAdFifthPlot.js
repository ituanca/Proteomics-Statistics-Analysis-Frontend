import React, {useEffect, useState} from "react";
import axios from "axios";
import {labelAndDropdownGroupWithSpace, renderErrorMessage} from "../Utils";
import {
    generalOptionsAD,
    getTypeOfGroupAD,
    handleOptionChangeWithCorrelation,
    truncateText,
    validate
} from "../other/FunctionsForEntrySelectionPlot";

export default function StatisticsAdFifthPlot(){

    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        entries: "select at least 1 protein",
    };
    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const filteredData = JSON.parse(localStorage.getItem('selectedOptions'))
    const Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
    const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];
    const proteinOptions = [
        {name: "entry_id_1", label: "Protein ID 1", type: "select", values: newIds},
        {name: "entry_name_1", label: "Protein Name 1", type: "select", values: newProteinNames},
        {name: "entry_id_2", label: "Protein ID 2", type: "select", values: newIds},
        {name: "entry_name_2", label: "Protein Name 2", type: "select", values: newProteinNames},
        {name: "entry_id_3", label: "Protein ID 3", type: "select", values: newIds},
        {name: "entry_name_3", label: "Protein Name 3", type: "select", values: newProteinNames},
        {name: "entry_id_4", label: "Protein ID 4", type: "select", values: newIds},
        {name: "entry_name_4", label: "Protein Name 4", type: "select", values: newProteinNames},
        {name: "entry_id_5", label: "Protein ID 5", type: "select", values: newIds},
        {name: "entry_name_5", label: "Protein Name 5", type: "select", values: newProteinNames}
    ];
    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        entry_id_1: "", entry_name_1: "",
        entry_id_2: "", entry_name_2: "",
        entry_id_3: "", entry_name_3: "",
        entry_id_4: "", entry_name_4: "",
        entry_id_5: "", entry_name_5: "",
        metric: "",
        type_of_plot: ""
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
                    [generalOptionsAD[0].name]: generalOptionsAD[0].values[0],
                    [generalOptionsAD[1].name]: generalOptionsAD[1].values[0],
                    [generalOptionsAD[2].name]: generalOptionsAD[2].values[0],
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
                .post("http://localhost:8000/requestAdFifthChart", JSON.stringify(selectedOptions), {
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
                    {labelAndDropdownGroupWithSpace(generalOptionsAD[0], selectedOptions, setSelectedOptions, proteinOptions)}
                    {proteinOptions.map((option) =>
                            <div key={option.name} className={getTypeOfGroupAD(option)}>
                                <label className="label-statistics">{option.label}</label>
                                <select className="input-for-statistics-ad-select"
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChangeWithCorrelation(option.name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                                >
                                    {option.values.map((value) => (
                                        <option key={value} value={value}>
                                            {truncateText(value, 60)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                    )}
                    {labelAndDropdownGroupWithSpace(generalOptionsAD[1], selectedOptions, setSelectedOptions, proteinOptions)}
                    {labelAndDropdownGroupWithSpace(generalOptionsAD[2], selectedOptions, setSelectedOptions, proteinOptions)}
                    {labelAndDropdownGroupWithSpace(filterForChoiceOfImputationMethod, selectedOptions, setSelectedOptions, proteinOptions)}
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
