import React, {useEffect, useState} from "react";
import axios from "axios";
import '../Statistics.css';

export default function StatisticsAdThirdPlot({optionsForThirdPlot, path}){

    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        type_of_plot: "",
        representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [optionsForThirdPlot[0].name]: optionsForThirdPlot[0].values[0],
            [optionsForThirdPlot[1].name]: optionsForThirdPlot[1].values[0],
            [optionsForThirdPlot[2].name]: optionsForThirdPlot[2].values[0]
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

    const handleOptionChange = (option, value) => {
        setSelectedOptions({...selectedOptions, [option]: value});
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics-options">
                    {/*<h4>View the number/percentage of missing values for each sample by gender</h4>*/}
                    {optionsForThirdPlot.map((option) => (
                        <div key={option.name} className="label-field-group-with-space">
                            <label className="label-statistics">{option.label}</label>
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
                        </div>
                    ))}
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
