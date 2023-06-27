import {useState, useEffect} from "react";
import {renderErrorMessage} from "../utils/Utils";
import LoadingSpinner from "../utils/LoadingSpinner";
import React from "react";
import axios from "axios";

export default function GeneralStatisticsArtificialImputation(){

    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))
    const [errorMessages, setErrorMessages] = useState({});
    const errorsStatistics = {
        param_not_specified: "You have to specify the parameter needed fo the missing values insertion",
        out_of_bounds: "The values must belong to the interval [0,100]",
        separate_not_allowed: "The separate imputation cannot be performed! You can only choose the full option"
    };
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
    const [paramsForGeneralStatistics, setParamsForGeneralStatistics] = useState({
        percentage_missing_data: "",
        MNAR_rate: "",
        type_of_imputation: "",
        imputation_method: "",
    })
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [nameOfErrorMetric, setNameOfErrorMetric] = useState("");
    const [oneTypeOfErrorClicked, setOneTypeOfErrorClicked] = useState(false);
    const [errors, setErrors] = useState([]);
    const [errorsForDisplay, setErrorsForDisplay] = useState([]);
    const [errorMetricsIds, setErrorMetricsIds] = useState([])
    const [resultsOfErrorMetricsFetched, setResultsOfErrorMetricsFetched] = useState(false);

    useEffect(() => {
        console.log(paramsForGeneralStatistics)
        fetch('http://localhost:8000/getErrorMetrics')
            .then((response) => response.json())
            .then((json) => {
                setErrorMetricsIds(json)
            })
            .catch((error) => console.log(error));
    }, [])

    useEffect(() => {
        setParamsForGeneralStatistics({...paramsForGeneralStatistics,
            type_of_imputation: filterForChoiceOfImputationType.values[0],
            imputation_method: filterForChoiceOfImputationMethod.values[0]
        });
    },[filterForChoiceOfImputationMethod, filterForChoiceOfImputationType])

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

    const validate = (param) => {
        if(param === ""){
            setErrorMessages({name: "param_not_specified", message: errorsStatistics.param_not_specified});
        }else if (parseInt(param) < 0 || parseInt(param) > 100){
            setErrorMessages({name: "out_of_bounds", message: errorsStatistics.out_of_bounds});
        }else if (paramsForGeneralStatistics.type_of_imputation === "separate" && (selectedOptionsForTable.class1.length < 3 || selectedOptionsForTable.class2.length < 3)){
            setErrorMessages({name: "separate_not_allowed", message: errorsStatistics.separate_not_allowed});
        }else{
            setErrorMessages({});
            return true;
        }
        return false;
    }

    const handleChoiceOfParam = (event, param) => {
        if(validate(param)){
            setIsLoading(true)
            console.log(paramsForGeneralStatistics)
            let tempParams = paramsForGeneralStatistics
            if(param === paramsForGeneralStatistics.percentage_missing_data){
                tempParams.MNAR_rate = "";
            }else{
                tempParams.percentage_missing_data = "";
            }
            console.log(tempParams)
            axios
                .post("http://localhost:8000/requestErrorsForOneFixedParameter", JSON.stringify(tempParams) )
                .then((response) => {
                    console.info(response);
                    let tempListOfErrors = [];
                    Object.keys(response.data).map((variableValue) => {
                        let tempListOfMetrics = [];
                        Object.keys(response.data[variableValue]).map((errorMetric) => {
                            tempListOfMetrics[errorMetric] = response.data[variableValue][errorMetric]
                        })
                        tempListOfErrors[(parseInt(variableValue)+1)*10] = tempListOfMetrics
                    })
                    setErrors(tempListOfErrors)
                    setIsLoading(false);
                    setResultsOfErrorMetricsFetched(true);
                    setOneTypeOfErrorClicked(false)
                })
                .catch((error) => {
                    console.error("There was an error!", error.response.data.message)
                });
        }
    }

    function setCompleteName (id) {
        if(id === errorMetricsIds[0]) return "Mean Absolute Error"
        else if(id === errorMetricsIds[1]) return "Root Mean Squared Error"
        else if(id === errorMetricsIds[2]) return "Mean Absolute Percentage Error"
    }

    useEffect(() => {
        if(errors !== [] && errorsForDisplay !== []){
            setIsLoading(false);
        }
    }, [errors, errorsForDisplay])

    const handleOneTypeOfErrorClick = (event, id) => {
        axios
            .post("http://localhost:8000/requestErrorsChartForOneFixedParameter", JSON.stringify(id), {
                responseType: "arraybuffer"
            })
            .then((response) => {
                console.info(response);
                setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
                setIsLoading(true);
                setNameOfErrorMetric(setCompleteName(id))
                setOneTypeOfErrorClicked(true)
                let tempErrors = [];
                Object.keys(errors).map((imputationMethod) => {
                    tempErrors[imputationMethod] = errors[imputationMethod][id]
                })
                setErrorsForDisplay(tempErrors)
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    }

    const handleOptionChange = (option, value) => {
        setParamsForGeneralStatistics({...paramsForGeneralStatistics, [option]: value});
    };

    const handleParamsForGeneralStatisticsInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        setParamsForGeneralStatistics({ ...paramsForGeneralStatistics, [name] : value});
    }

    return (
        <div className="container-statistics-ai col">
            <div className="statistics-view-errors">
                <div className="center-positioning">
                    <div className="indication-label">
                        <label className="label-statistics-ai">You can view statistics based on a
                            <strong className="colored-text"> fixed percentage of missing values</strong> and
                            <strong className="colored-text"> variable MNAR rate</strong>
                        </label>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics-ai">Insert the percentage of missing values</label>
                        <input className="input-ai-text-field"
                               type="number"
                               value={paramsForGeneralStatistics.percentage_missing_data}
                               onChange={handleParamsForGeneralStatisticsInput}
                               name="percentage_missing_data" required
                               id="percentage_missing_data"/>
                    </div>
                    <div className="indication-label">
                        <label className="label-statistics-ai">
                            <strong className="colored-text"> or </strong>
                        </label>
                    </div>
                    <div className="indication-label">
                        <label className="label-statistics-ai">You can view statistics based on a
                            <strong className="colored-text"> fixed MNAR rate</strong> and
                            <strong className="colored-text"> variable percentage of missing values </strong>
                        </label>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics-ai">Insert the rate of Missing-Not-At-Random</label>
                        <input className="input-ai-text-field"
                               type="number"
                               value={paramsForGeneralStatistics.MNAR_rate}
                               onChange={handleParamsForGeneralStatisticsInput}
                               name="MNAR_rate" required
                               id="MNAR_rate"/>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics-ai">
                            <div>{filterForChoiceOfImputationType.label} (You cannot choose to perform separate imputation unless there are at least 3 samples in each class)</div>
                        </label>
                        <select className="input-for-statistics-ad-select input-ai"
                                value={paramsForGeneralStatistics[filterForChoiceOfImputationType.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfImputationType.name, e.target.value)}
                        >
                            {filterForChoiceOfImputationType.values.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="label-field-group-with-space">
                        <label className="label-statistics-ai">{filterForChoiceOfImputationMethod.label}</label>
                        <select className="input-for-statistics-ad-select input-ai"
                                value={paramsForGeneralStatistics[filterForChoiceOfImputationMethod.name]}
                                onChange={(e) => handleOptionChange(filterForChoiceOfImputationMethod.name, e.target.value)}
                        >
                            {filterForChoiceOfImputationMethod.values.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    {renderErrorMessage("param_not_specified", errorMessages)}
                    {renderErrorMessage("out_of_bounds", errorMessages)}
                    {renderErrorMessage("separate_not_allowed", errorMessages)}
                    <div className="input-container-row-less-space">
                        <button className="general-button button-general-statistics-ai"
                                onClick= {(event) => handleChoiceOfParam(event, paramsForGeneralStatistics.percentage_missing_data)}>
                            Statistics based on the introduced percentage of missing values
                        </button>
                        <button className="general-button button-general-statistics-ai"
                                onClick= {(event) => handleChoiceOfParam(event, paramsForGeneralStatistics.MNAR_rate)}>
                            Statistics based on the introduced MNAR rate
                        </button>
                    </div>
                </div>
            </div>
            { isLoading ? <LoadingSpinner /> : null}
            { !isLoading && resultsOfErrorMetricsFetched &&
                <div className="statistics-view-errors">
                    <div className="container-col-artificial-imputation row">
                        <div className="statistics-view-errors">
                            <div className="button-in-col">
                                <button className="general-button errors-button"
                                        onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[0])}>Mean Absolute Error</button>
                            </div>
                            <div className="button-in-col">
                                <button className="general-button errors-button"
                                        onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[1])}>Root Mean Squared Error</button>
                            </div>
                            <div className="button-in-col">
                                <button className="general-button errors-button"
                                        onClick={(event) => handleOneTypeOfErrorClick(event, errorMetricsIds[2])}>Mean Absolute Percentage Error</button>
                            </div>
                        </div>
                        { oneTypeOfErrorClicked && Object.keys(errorsForDisplay) !== [] &&
                            <div className="statistics-view-errors">
                                <h4> {nameOfErrorMetric} </h4>
                                <ul>
                                    {Object.keys(errorsForDisplay).map((key, index) =>
                                        <li className="list-item-errors">
                                            <div className="left-part"><strong>{key}:</strong></div>
                                            <div className="right-part">{errorsForDisplay[key]}</div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                        { oneTypeOfErrorClicked && imageUrl !== "" &&
                            <img src={imageUrl} alt="My Plot"/>
                        }
                    </div>
                </div>
            }
        </div>
    );

}