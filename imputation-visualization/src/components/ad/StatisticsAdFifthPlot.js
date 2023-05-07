import React, {useEffect, useState} from "react";
import FunctionsForProteinsSelectionPlot from "./FunctionsForProteinsSelectionPlot";
import axios from "axios";
import {handleOptionChange, renderErrorMessage} from "../Utils";

export default function StatisticsAdFifthPlot({ data }){

    const path = "http://localhost:8000/requestAdProteinsComparisonChartBeforeAndAfterImputation";
    // return (
    //     <FunctionsForProteinsSelectionPlot data={data} path={path}/>
    // );

    const [errorMessages, setErrorMessages] = useState({});
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
    const errors = {
        proteins: "select at least 2 proteins",
    };
    const Ids = [...new Set(data.rows.map((item) => item["Majority.protein.IDs"]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
    const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];
    const [generalOptions, setGeneralOptions] = useState([
        {name: "gender", label: "Gender", type: "select", values: ["All", "Male", "Female"],},
        {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation", "variance"]},
        {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
    ]);
    const [filterForChoiceOfImputationMethod, setFilterForChoiceOfImputationMethod] = useState({
        name: "imputation_method",
        label: "Choose the imputation method",
        type: "select",
        values: []
    });
    const proteinOptions = [
        {name: "protein_id_1", label: "Protein ID 1", type: "select", values: newIds},
        {name: "protein_name_1", label: "Protein Name 1", type: "select", values: newProteinNames},
        {name: "protein_id_2", label: "Protein ID 2", type: "select", values: newIds},
        {name: "protein_name_2", label: "Protein Name 2", type: "select", values: newProteinNames},
        {name: "protein_id_3", label: "Protein ID 3", type: "select", values: newIds},
        {name: "protein_name_3", label: "Protein Name 3", type: "select", values: newProteinNames},
        {name: "protein_id_4", label: "Protein ID 4", type: "select", values: newIds},
        {name: "protein_name_4", label: "Protein Name 4", type: "select", values: newProteinNames},
        {name: "protein_id_5", label: "Protein ID 5", type: "select", values: newIds},
        {name: "protein_name_5", label: "Protein Name 5", type: "select", values: newProteinNames}
    ];

    useEffect(() => {
        fetch('http://localhost:8000/getImputationMethods')
            .then((response) => response.json())
            .then((json) => {
                setFilterForChoiceOfImputationMethod({...filterForChoiceOfImputationMethod, values: json});
                setSelectedOptions({...selectedOptions,
                    [generalOptions[0].name]: generalOptions[0].values[0],
                    [generalOptions[1].name]: generalOptions[1].values[0],
                    [generalOptions[2].name]: generalOptions[2].values[0],
                    [generalOptions[3].name]: generalOptions[3].values[0],
                    [filterForChoiceOfImputationMethod.name]: json[0]
                });
            })
            .catch((error) => console.log(error));
    }, [])

    const validate = () => {
        if (selectedOptions.protein_id_1 === "" || selectedOptions.protein_id_2 === "") {
            setErrorMessages({name: "proteins", message: errors.proteins});
        } else {
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        if(validate()){
            axios
                .post(path, JSON.stringify(selectedOptions), {
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

    const getTypeOfGroup = (option) => {
        if(option.name === "gender" || option.name === "protein_name_1" || option.name === "protein_name_2" || option.name === "protein_name_3"
            || option.name === "protein_name_4" || option.name === "protein_name_5" || option.name === "metric"){
            return "label-field-group-with-space"
        }
        return "label-field-group";
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics-options">
                    {/*<h3>Compare up to 5 proteins according to a metric</h3>*/}
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{generalOptions[0].label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[generalOptions[0].name]}
                                onChange={(e) => handleOptionChange(generalOptions[0].name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                        >
                            {generalOptions[0].values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    {proteinOptions.map((option) =>
                            // ( option.nr <= count ? (
                            <div key={option.name} className={getTypeOfGroup(option)}>
                                <label className="label-statistics">{option.label}</label>
                                <select className="input-for-statistics-ad-select"
                                    // disabled={!option.enabled}
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                                >
                                    {option.values.map((value) => (
                                        <option key={value} value={value}>
                                            {truncateText(value, 60)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        // ) : null)
                    )}
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{generalOptions[1].label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[generalOptions[1].name]}
                                onChange={(e) => handleOptionChange(generalOptions[1].name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                        >
                            {generalOptions[1].values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{generalOptions[2].label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[generalOptions[2].name]}
                                onChange={(e) => handleOptionChange(generalOptions[2].name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                        >
                            {generalOptions[2].values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics">{filterForChoiceOfImputationMethod.label}</label>
                        <select className="input-for-statistics-ad-select"
                                value={selectedOptions[filterForChoiceOfImputationMethod.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfImputationMethod.name, e.target.value, selectedOptions, setSelectedOptions, proteinOptions, data)}
                        >
                            {filterForChoiceOfImputationMethod.values.map((value) => (
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
