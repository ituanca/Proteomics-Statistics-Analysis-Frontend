import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleOptionChange, renderErrorMessage} from "./Utils";


export default function StatisticsAdFirstPlot({ data, options }){

    const [errorMessages, setErrorMessages] = useState({});
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

    const [imageUrl, setImageUrl] = useState("");

    const errors = {
        proteins: "select at least 2 proteins",
    };

    useEffect(() => {
        setSelectedOptions({...selectedOptions, [options[0].name]: options[0].values[0],
            [options[11].name]: options[11].values[0],
            [options[12].name]: options[12].values[0]
        });
    }, [])

    const validate = () => {
        if(selectedOptions.protein_id_1 === "" || selectedOptions.protein_id_2 === ""){
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
                .post("http://localhost:8000/requestAdChart", JSON.stringify(selectedOptions), {
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

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics_options">
                    <h3>Compare up to 5 proteins according to a metric</h3>
                    {options.map((option) => (
                        <div key={option.name} className={getTypeOfGroup(option)}>
                            <label className="label-statistics">{option.label}</label>
                            {option.type === "select" ? (
                                <select className="input-for-statistics-ad-select"
                                        value={selectedOptions[option.name]}
                                        onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions, options, data)}
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
                                    onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions, options, data)}
                                />
                            )}
                        </div>
                    ))}
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
