import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import axios from "axios";

export default function InputForStatisticsProgeria({ data }){

    const [selectedOptions, setSelectedOptions] = useState({
        gender: "",
        protein_id_1: "", protein_name_1: "",
        protein_id_2: "", protein_name_2: "",
        protein_id_3: "", protein_name_3: "",
        protein_id_4: "", protein_name_4: "",
        protein_id_5: "", protein_name_5: "",
        metric: "",
        type_of_plot: ""
    });

    const Ids = [...new Set(data.rows.map((item) => item["Majority.protein.IDs"]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
    const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];

    const optionsForProteinsComparison = [
        {
            name: "gender",
            label: "Gender",
            type: "select",
            values: ["All", "Male", "Female"],
        },
        {
            name: "protein_id_1",
            label: "Protein ID 1",
            type: "select",
            values: newIds
        },
        {
            name: "protein_name_1",
            label: "Protein Name 1",
            type: "select",
            values: newProteinNames
        },
        {
            name: "protein_id_2",
            label: "Protein ID 2",
            type: "select",
            values: newIds
        },
        {
            name: "protein_name_2",
            label: "Protein Name 2",
            type: "select",
            values: newProteinNames
        },
        {
            name: "protein_id_3",
            label: "Protein ID 3",
            type: "select",
            values: newIds
        },
        {
            name: "protein_name_3",
            label: "Protein Name 3",
            type: "select",
            values: newProteinNames
        },
        {
            name: "protein_id_4",
            label: "Protein ID 4",
            type: "select",
            values: newIds
        },
        {
            name: "protein_name_4",
            label: "Protein Name 4",
            type: "select",
            values: newProteinNames
        },
        {
            name: "protein_id_5",
            label: "Protein ID 5",
            type: "select",
            values: newIds
        },
        {
            name: "protein_name_5",
            label: "Protein Name 5",
            type: "select",
            values: newProteinNames
        },
        {
            name: "metric",
            label: "Metric for comparison",
            type: "select",
            values: ["mean", "median", "standard deviation", "variance"]
        },
        {
            name: "type_of_plot",
            label: "Type of chart",
            type: "select",
            values: ["bar chart", "pie chart"]
        },
        // add more options as needed
    ];

    useEffect(() => {
        setSelectedOptions({...selectedOptions, [optionsForProteinsComparison[0].name]: optionsForProteinsComparison[0].values[0],
            [optionsForProteinsComparison[11].name]: optionsForProteinsComparison[11].values[0],
            [optionsForProteinsComparison[12].name]: optionsForProteinsComparison[12].values[0]
        });
    }, [])


    function handleSelectionsCorrelation(option, value, crtId, crtName) {
        if(value !== "-- Select an option --"){
            if(option === crtId){
                const nameOption = optionsForProteinsComparison.find((option) => option.name === crtName)
                const correspondingName = data.rows.find((d) => d["Majority.protein.IDs"] === value)["Protein.names"];
                setSelectedOptions({ ...selectedOptions, [option]: value, [nameOption.name]: correspondingName });
            }else if(option === crtName){
                const idOption = optionsForProteinsComparison.find((option) => option.name === crtId)
                const correspondingId = data.rows.find((d) => d["Protein.names"] === value)["Majority.protein.IDs"];
                setSelectedOptions({...selectedOptions, [option]: value, [idOption.name]: correspondingId});
            }
        }else{
            if(option === crtId){
                const nameOption = optionsForProteinsComparison.find((option) => option.name === crtName)
                setSelectedOptions({ ...selectedOptions, [option]: "", [nameOption.name]: ""});
            }else if(option === crtName){
                const idOption = optionsForProteinsComparison.find((option) => option.name === crtId)
                setSelectedOptions({...selectedOptions, [option]: "", [idOption.name]: ""});
            }
        }
    }

    const handleOptionChange = (option, value) => {
        setSelectedOptions({...selectedOptions, [option]: value});
        // onChange({ ...selectedOptions, [option]: value });
        handleSelectionsCorrelation(option, value, "protein_id_1", "protein_name_1");
        handleSelectionsCorrelation(option, value, "protein_id_2", "protein_name_2");
        handleSelectionsCorrelation(option, value, "protein_id_3", "protein_name_3");
        handleSelectionsCorrelation(option, value, "protein_id_4", "protein_name_4");
        handleSelectionsCorrelation(option, value, "protein_id_5", "protein_name_5");
    };

    const testVariable = "test"

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOptions)
        axios
            .post("http://localhost:8000/requestAdChart", JSON.stringify(selectedOptions),)
            .then((response) => {
                console.info(response);
                // if (response.data === "name_error") {
                //     setErrorMessages({name: "name", message: errors.name});
                // } else if(response.data === "exercise_exists"){
                //     setErrorMessages({name: "exists_name", message: errors.exists_name});
                // } else if (response.data === "calories_error"){
                //     setErrorMessages({name: "caloriesBurnedPerMinute", message: errors.caloriesBurnedPerMinute});
                // } else {
                //     setIsSubmitted(true);
                // }
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    };

    const renderForm = (
        <form onSubmit = {handleSubmit}>
            <div className="button-container-col">
                <h2>Generate statistics on the incomplete dataset</h2>
                <div className="statistics_options">
                    <h3>Compare up to 5 proteins according to a metric</h3>
                    {optionsForProteinsComparison.map((option) => (
                        <div key={option.name}>
                            <label className="label-statistics">{option.label}</label>
                            {option.type === "select" ? (
                                <select className="input-for-statistics-ad-select"
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                >
                                    {option.values.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={selectedOptions[option.name]}
                                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
            </div>
        </form>
    );

    return (
        <div className="app">
            <div>
                {renderForm}
                <Outlet />
            </div>
        </div>
    );
}
