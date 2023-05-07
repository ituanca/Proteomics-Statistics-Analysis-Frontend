import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";

export default function ImputationMethodChoice(){

    const [selectedMethod, setSelectedMethod] = useState({
        imputation_method: ""
    });
    const [incompleteFullAD, setIncompleteFullAD] = useState([])
    const [imputedAD, setImputedAD] = useState([])
    const [incompleteData, setIncompleteData] = useState( {
        columns: [],
        rows: []
    })
    const [imputedData, setImputedData] = useState( {
        columns: [],
        rows: []
    })
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
                setSelectedMethod({...selectedMethod, imputation_method: json[0]});
            })
            .catch((error) => console.log(error));
    }, [])

    useEffect(() => {
        if(incompleteFullAD.length > 0) {
            setIncompleteData({...incompleteData, columns: Object.keys(incompleteFullAD[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: incompleteFullAD})
        }
        if(imputedAD.length > 0) {
            setImputedData({...imputedData, columns: Object.keys(imputedAD[0]).map(key => {
                    return {
                        label: key, field: key, sort: 'asc'
                    };
                }), rows: imputedAD})
        }
    }, [incompleteFullAD, imputedAD])

    const fetchIncompleteFullAD = () => {
        fetch('http://localhost:8000/getIncompleteNormalizedDatasetAD')
            .then((response) => response.json())
            .then((json) => {
                setIncompleteFullAD(json)
            })
            .catch((error) => console.log(error));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("http://localhost:8000/performImputation", JSON.stringify(selectedMethod))
            .then((response) => {
                console.info(response);
                setImputedAD(response.data)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    };

    const handleOptionChange = (option, value) => {
        setSelectedMethod({...selectedMethod, [option]: value});
    };

    return (
        <div>
            <div className="container-row">
                <div className="statistics-options">
                    <div className="input-container-col">
                        <button onClick={fetchIncompleteFullAD} className="go-back-button">
                            View incomplete normalized dataset
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    {(incompleteFullAD.length > 0) ?
                        <div className="table-position">
                            <MDBTable scrollY maxHeight="400px">
                                <MDBTableHead columns={incompleteData.columns}/>
                                <MDBTableBody rows={incompleteData.rows} />
                            </MDBTable>
                        </div>
                        : null}
                </div>
            </div>
            <form onSubmit = {handleSubmit}>
                <div className="container-row">
                    <div className="statistics-options">
                        <div className="label-field-group-with-space">
                            <label className="label-statistics">{filterForChoiceOfImputationMethod.label}</label>
                            <select className="input-for-statistics-ad-select"
                                    value={selectedMethod[filterForChoiceOfImputationMethod.name]}
                                    onChange={(e) => handleOptionChange(filterForChoiceOfImputationMethod.name, e.target.value)}
                            >
                                {filterForChoiceOfImputationMethod.values.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-container-col">
                            <input type="submit" value="View the complete dataset"/>
                        </div>
                    </div>
                    <div className="table-container">
                        {(imputedAD.length > 0) ?
                            <div className="table-position">
                                <MDBTable scrollY maxHeight="400px">
                                    <MDBTableHead columns={imputedData.columns}/>
                                    <MDBTableBody rows={imputedData.rows} />
                                </MDBTable>
                            </div>
                            : null}
                    </div>
                </div>
            </form>
        </div>
    );
}
