import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import Accordion from '../Accordion';
import "../Accordion.css"
import ImputationExecution from "../ImputationExecution";
import {
    generalOptionsProgeria, handleOptionChange,
    optionsForThirdPlotProgeria
} from "../UtilsStatistics";
import FirstPlot from "../plots/FirstPlot";
import SecondPlot from "../plots/SecondPlot";
import ThirdPlot from "../plots/ThirdPlot";
import FourthPlot from "../plots/FourthPlot";
import FifthPlot from "../plots/FifthPlot";
import SixthPlot from "../plots/SixthPlot";

export default function StatisticsProgeria(){

    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const errors1stPlot = {
        entries: "select at least 2 proteins",
    };
    const filteredData = JSON.parse(localStorage.getItem('selectedOptions'))
    const Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const entryOptions = [
        {name: "entry_id_1", label: "Protein ID 1", type: "select", values: newIds},
        {name: "entry_id_2", label: "Protein ID 2", type: "select", values: newIds},
        {name: "entry_id_3", label: "Protein ID 3", type: "select", values: newIds},
        {name: "entry_id_4", label: "Protein ID 4", type: "select", values: newIds},
        {name: "entry_id_5", label: "Protein ID 5", type: "select", values: newIds},
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
    const samples = [...new Set((data.columns.slice(2,(data.columns).length)).map((column) => column.label))];
    const filterForSamplesChoice = {
        name: "samples",
        label: "Samples to be compared",
        type: "multi-select",
        values: samples
    };
    const condForTypeOfGroup = (option) => (option.name === "class" || option.name === "metric")

    // 2nd plot
    const errors2ndPlot = {
        entries: "select at least 1 protein",
    };

    //4th plot
    const filterForChoiceOfRepresentation = {
        name: "type_of_representation",
        label: "Type of representation",
        type: "select",
        values: ["distribution of missing values for each sample", "distribution of missing values for each protein"]
    };

    // 6th plot
    const optionsForSixthPlot = [
        {name: "class", label: "Class", type: "select", values: ["All", "With or without Progeria"]},
        {name: "type_of_representation", label: "Type of representation", type: "select", values: ["percentage of missing values", "percentage of missing values per samples"]}
    ];

    //5th plot
    const errors5thPlot = {
        entries: "select at least 1 protein",
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

    const accordionDataIncompleteDataset = [
        {
            title: 'Compare up to 5 proteins according to a metric',
            content: <FirstPlot errors={errors1stPlot} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}
                                generalOptions={generalOptionsProgeria} limitForEnoughEntries={5} path="requestProgeriaFirstChart"
                                entryOptions={entryOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChange}/>
        },
        {
            title: 'Compare the number of missing values for the selected samples',
            content: <SecondPlot samplesFilter={filterForSamplesChoice} errors={errors2ndPlot} path="requestAdSecondChart"/>
        },
        {
            title: 'Compare the number/percentage of missing values for each sample by gender',
            content: <ThirdPlot options={optionsForThirdPlotProgeria} path="requestProgeriaThirdChart"/>
        },
        {
            title: 'Compare the missing values distribution for each class',
            content: <FourthPlot path = "requestProgeriaFourthChart" filterForChoiceOfRepresentation={filterForChoiceOfRepresentation}/>
        },
        {
            title: 'View the percentage of the missing values',
            content: <SixthPlot path = "requestProgeriaSixthChart" options={optionsForSixthPlot}/>
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
            title: 'Compare up to 5 proteins according to a metric before and after imputation',
            content: <FifthPlot generalOptions={generalOptionsProgeria} path="requestProgeriaFifthChart" errors={errors5thPlot}
                                selectedOptions={selectedOptions5thPlot} setSelectedOptions={setSelectedOptions5thPlot}
                                limitForEnoughEntries={5} entryOptions={entryOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChange}/>
        },
    ];

    const renderForm = (

        <div className="accordion">
            <h3>Generate statistics on the incomplete dataset</h3>
            {accordionDataIncompleteDataset.map(({ title, content }, index) => (
                <div key={index}>  {/*need this key to eliminate the prop warning*/}
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
