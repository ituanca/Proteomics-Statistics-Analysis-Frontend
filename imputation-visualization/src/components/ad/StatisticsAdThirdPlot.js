import React, {useEffect, useState} from "react";
import axios from "axios";
import './StatisticsAdSecondPlot.css';

export default function StatisticsAdThirdPlot(){

    const [selectedOptions, setSelectedOptions] = useState({
        gender: "",
        type_of_plot: "",
        representation: ""
    });
    const [imageUrl, setImageUrl] = useState("");

    const options = [
        {name: "gender", label: "Gender", type: "select", values: ["All", "Male", "Female"]},
        {name: "representation", label: "View as", type: "select", values: ["number", "percentage"]},
        {name: "type_of_plot", label: "Type of chart", type: "select", values: ["vertical bar chart", "horizontal bar chart"]}
    ];

    useEffect(() => {
        setSelectedOptions({...selectedOptions,
            [options[0].name]: options[0].values[0],
            [options[1].name]: options[1].values[0],
            [options[2].name]: options[2].values[0]
        });
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("http://localhost:8000/requestAdThirdChart", JSON.stringify(selectedOptions), {
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
                <div className="statistics_options">
                    <h4>View the number/percentage of missing values for each sample by gender</h4>
                    {options.map((option) => (
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
