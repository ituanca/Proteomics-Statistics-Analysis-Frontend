import React, {useEffect, useState} from "react";
import axios from "axios";
import {Multiselect} from "multiselect-react-dropdown";
import './StatisticsAdSecondPlot.css';

export default function StatisticsAdSecondPlot({ samplesFilter }){

    const [selectedSamples, setSelectedSamples] = useState({
        samples: []
    });
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedSamples)

        axios
            .post("http://localhost:8000/requestAdSecondChart", JSON.stringify(selectedSamples), {
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

    const onChangeMultiSelect = (selectedItems) => {
        setSelectedSamples({...selectedSamples, samples: selectedItems})
    };
    console.log(selectedSamples)

    return (
        <form onSubmit = {handleSubmit}>
            <div className="container-row">
                <div className="statistics_options">
                    <h4>View the number of missing values for the selected samples</h4>
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
                    <div className="input-container-col">
                        <input type="submit" value="Generate plot"/>
                    </div>
                </div>
                {imageUrl !== "" ? <img src={imageUrl} alt="My Plot" /> : null}
            </div>
        </form>
    );
}
