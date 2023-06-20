import React from "react";
import {Link, Outlet} from "react-router-dom";
import Accordion from '../Accordion';
import "../Accordion.css"
import ImputationExecution from "../ImputationExecution";
import {generalOptions, handleOptionChange} from "../UtilsStatistics";
import FirstPlot from "../plots/FirstPlot";
import {useState} from "react";
import SecondPlot from "../plots/SecondPlot";
import ThirdPlot from "../plots/ThirdPlot";
import FourthPlot from "../plots/FourthPlot";
import FifthPlot from "../plots/FifthPlot";
import SixthPlot from "../plots/SixthPlot";

export default function StatisticsOther(){

    const errors1stPlot = {
        entries: "select at least 2 entries",
    };
    // data, filteredData, Ids, newIds and entryOptions have to be declared here, otherwise they don't update unless I refresh the page
    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const filteredData = JSON.parse(localStorage.getItem('selectedOptions'))
    const samples = [...filteredData.class1, ...filteredData.class2]
    const Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const entryOptions = [
        {name: "entry_id_1", label: "Entry ID 1", type: "select", values: newIds},
        {name: "entry_id_2", label: "Entry ID 2", type: "select", values: newIds},
        {name: "entry_id_3", label: "Entry ID 3", type: "select", values: newIds},
        {name: "entry_id_4", label: "Entry ID 4", type: "select", values: newIds},
        {name: "entry_id_5", label: "Entry ID 5", type: "select", values: newIds},
    ];
    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        entry_id_1: "",
        entry_id_2: "",
        entry_id_3: "",
        entry_id_4: "",
        entry_id_5: "",
        metric: "",
        type_of_plot: ""
    });
    const filterForSamplesChoice = {
        name: "samples",
        label: "Samples to be compared",
        type: "multi-select",
        values: samples
    };
    const condForTypeOfGroup = (option) => (option.name === "class" || option.name === "metric")

    //2nd plot
    const errors2ndPlot = {
        entries: "select at least 1 entry",
    };

    //3rd plot
    const options3rdPlot = [
        {name: "class", label: "Class", type: "select", values: ["All", "Class1", "Class2"]},
        {name: "representation", label: "View as", type: "select", values: ["number", "percentage"]},
        {name: "type_of_plot", label: "Type of chart", type: "select", values: ["vertical bar chart", "horizontal bar chart"]}
    ];

    //4th plot
    const filterForChoiceOfRepresentation = {
        name: "type_of_representation",
        label: "Type of representation",
        type: "select",
        values: ["distribution of missing values for each sample", "distribution of missing values for each entry"]
    };

    //5th plot
    const errors5thPlot = {
        entries: "select at least 1 entry",
        separate_not_allowed: "The separate imputation cannot be performed! You can only choose the full option"
    };
    const [selectedOptions5thPlot, setSelectedOptions5thPlot] = useState({
        class: "",
        entry_id_1: "",
        entry_id_2: "",
        entry_id_3: "",
        entry_id_4: "",
        entry_id_5: "",
        metric: "",
        type_of_plot: "",
        imputation_method: ""
    });

    //6th plot
    const optionsForSixthPlot = [
        {name: "class", label: "Class", type: "select", values: ["All",  "Per classes"]},
        {name: "type_of_representation", label: "Type of representation", type: "select", values: ["percentage of missing values", "percentage of missing values per samples"]}
    ];

    const accordionDataIncompleteDataset = [
        {
            title: 'Compare up to 5 entries according to a metric',
            content: <FirstPlot errors={errors1stPlot} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}
                                generalOptions={generalOptions} limitForEnoughEntries={5} path="requestGeneralFirstChart"
                                entryOptions={entryOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChange}/>
        },
        {
            title: 'Compare the number of missing values for the selected samples',
            content: <SecondPlot samplesFilter={filterForSamplesChoice} errors={errors2ndPlot} path="requestGeneralSecondChart"/>
        },
        {
            title: 'Compare the number/percentage of missing values for each sample by class',
            content: <ThirdPlot options={options3rdPlot} path="requestGeneralThirdChart"/>
        },
        {
            title: 'Compare the missing values distribution for each class',
            content: <FourthPlot path = "requestGeneralFourthChart" filterForChoiceOfRepresentation={filterForChoiceOfRepresentation}/>
        },
        {
            title: 'View the percentage of the missing values',
            content: <SixthPlot path = "requestGeneralSixthChart" options={optionsForSixthPlot}/>
        }
    ];

    const accordionDataPerformImputation = [
        {
            title: 'View the normalized incomplete dataset and perform imputation with the preferred method',
            content: <ImputationExecution/>
        }
    ];

    const accordionDataImputedDataset = [
        {
            title: 'Compare up to 5 entries according to a metric before and after imputation',
            content: <FifthPlot generalOptions={generalOptions} path="requestGeneralFifthChart" errors={errors5thPlot}
                                selectedOptions={selectedOptions5thPlot} setSelectedOptions={setSelectedOptions5thPlot}
                                limitForEnoughEntries={5} entryOptions={entryOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChange}/>
        },
    ];

    const renderForm = (
        <div className="accordion">
            <h3>Generate statistics on the incomplete dataset</h3>
            {accordionDataIncompleteDataset.map(({ title, content }, index) => (
                <div key={index}>
                    <Accordion title={title} content={content}/>
                </div>
            ))}
            <h3>Perform imputation</h3>
            {accordionDataPerformImputation.map(({ title, content }, index) => (
                <div key={index}>
                    <Accordion title={title} content={content} />
                </div>
            ))}
            <h3>Generate statistics on the dataset after imputation</h3>
            {accordionDataImputedDataset.map(({ title, content }, index) => (
                <div key={index}>
                    <Accordion title={title} content={content} />
                </div>
            ))}
        </div>
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
