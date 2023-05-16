import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import Accordion from '../Accordion';
import "../Accordion.css"
import ImputationExecution from "../ImputationExecution";
import {
    generalOptionsAD,
    handleOptionChangeWithCorrelation,
    optionsForThirdPlotAD
} from "../../uploadDataset/FunctionsForEntrySelectionPlot";
import FirstPlot from "../plots/FirstPlot";
import SecondPlot from "../plots/SecondPlot";
import ThirdPlot from "../plots/ThirdPlot";
import FourthPlot from "../plots/FourthPlot";
import FifthPlot from "../plots/FifthPlot";

export default function StatisticsAD(){

    const errors1stPlot = {
        entries: "select at least 2 proteins",
    };
    const errors2ndPlot = {
        entries: "select at least 1 protein",
    };
    const data = JSON.parse(localStorage.getItem('selectedDataset'))
    const filteredData = JSON.parse(localStorage.getItem('selectedOptions'))
    const Ids = [...new Set(data.rows.map((item) => item[filteredData.id]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
    const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];
    const proteinOptions = [
        {name: "entry_id_1", label: "Protein ID 1", type: "select", values: newIds},
        {name: "entry_name_1", label: "Protein Name 1", type: "select", values: newProteinNames},
        {name: "entry_id_2", label: "Protein ID 2", type: "select", values: newIds},
        {name: "entry_name_2", label: "Protein Name 2", type: "select", values: newProteinNames},
        {name: "entry_id_3", label: "Protein ID 3", type: "select", values: newIds},
        {name: "entry_name_3", label: "Protein Name 3", type: "select", values: newProteinNames},
        {name: "entry_id_4", label: "Protein ID 4", type: "select", values: newIds},
        {name: "entry_name_4", label: "Protein Name 4", type: "select", values: newProteinNames},
        {name: "entry_id_5", label: "Protein ID 5", type: "select", values: newIds},
        {name: "entry_name_5", label: "Protein Name 5", type: "select", values: newProteinNames}
    ];
    const [selectedOptions, setSelectedOptions] = useState({
        class: "",
        entry_id_1: "", entry_name_1: "",
        entry_id_2: "", entry_name_2: "",
        entry_id_3: "", entry_name_3: "",
        entry_id_4: "", entry_name_4: "",
        entry_id_5: "", entry_name_5: "",
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

    const condForTypeOfGroup = (option) => (option.name === "gender" || option.name === "entry_name_1" || option.name === "entry_name_2" ||
        option.name === "entry_name_3" || option.name === "entry_name_4" || option.name === "entry_name_5" || option.name === "metric")

    const errors5thPlot = {
        entries: "select at least 1 protein",
    };
    const [selectedOptions5thPlot, setSelectedOptions5thPlot] = useState({
        class: "",
        entry_id_1: "", entry_name_1: "",
        entry_id_2: "", entry_name_2: "",
        entry_id_3: "", entry_name_3: "",
        entry_id_4: "", entry_name_4: "",
        entry_id_5: "", entry_name_5: "",
        metric: "",
        type_of_plot: ""
    });

    const accordionDataIncompleteDataset = [
        {
            title: 'Compare up to 5 proteins according to a metric',
            content: <FirstPlot errors={errors1stPlot} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}
                                generalOptions={generalOptionsAD} limitForEnoughEntries={7} path="requestAdChart"
                                entryOptions={proteinOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChangeWithCorrelation}/>
        },
        {
            title: 'Compare the number of missing values for the selected samples',
            content: <SecondPlot samplesFilter={filterForSamplesChoice} errors={errors2ndPlot} path="requestAdSecondChart"/>
        },
        {
            title: 'Compare the number/percentage of missing values for each sample by gender',
            content: <ThirdPlot options={optionsForThirdPlotAD} path="requestAdThirdChart"/>
        },
        {
            title: 'Compare the missing values distribution for each gender',
            content: <FourthPlot path = "requestAdFourthChart"/>
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
            content: <FifthPlot generalOptions={generalOptionsAD} path="requestAdFifthChart" errors={errors5thPlot}
                                selectedOptions={selectedOptions5thPlot} setSelectedOptions={setSelectedOptions5thPlot}
                                limitForEnoughEntries={6} entryOptions={proteinOptions} condForTypeOfGroup={condForTypeOfGroup}
                                handleOptionChange={handleOptionChangeWithCorrelation}/>
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
