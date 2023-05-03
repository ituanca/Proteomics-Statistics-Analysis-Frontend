import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import StatisticsAdFirstPlot from "./StatisticsAdFirstPlot";
import StatisticsAdSecondPlot from "./StatisticsAdSecondPlot";
import StatisticsAdThirdPlot from "./StatisticsAdThirdPlot";
import StatisticsAdFourthPlot from "./StatisticsAdFourthPlot";


export default function StatisticsAD({ data }){

    const Ids = [...new Set(data.rows.map((item) => item["Majority.protein.IDs"]))];
    const newIds = [...new Set(["-- Select an option --", ...Ids])];
    const proteinNames = [...new Set(data.rows.map((item) => item["Protein.names"]))];
    const newProteinNames = [...new Set(["-- Select an option --", ...proteinNames])];

    const optionsForProteinsComparison = [
        {name: "gender", label: "Gender", type: "select", values: ["All", "Male", "Female"],},
        {name: "protein_id_1", label: "Protein ID 1", type: "select", values: newIds},
        {name: "protein_name_1", label: "Protein Name 1", type: "select", values: newProteinNames},
        {name: "protein_id_2", label: "Protein ID 2", type: "select", values: newIds},
        {name: "protein_name_2", label: "Protein Name 2", type: "select", values: newProteinNames},
        {name: "protein_id_3", label: "Protein ID 3", type: "select", values: newIds},
        {name: "protein_name_3", label: "Protein Name 3", type: "select", values: newProteinNames},
        {name: "protein_id_4", label: "Protein ID 4", type: "select", values: newIds},
        {name: "protein_name_4", label: "Protein Name 4", type: "select", values: newProteinNames},
        {name: "protein_id_5", label: "Protein ID 5", type: "select", values: newIds},
        {name: "protein_name_5", label: "Protein Name 5", type: "select", values: newProteinNames},
        {name: "metric", label: "Metric for comparison", type: "select", values: ["mean", "median", "standard deviation", "variance"]},
        {name: "type_of_plot", label: "Type of chart", type: "select", values: ["bar chart", "pie chart"]}
    ];

    const samples = [...new Set((data.columns.slice(2,(data.columns).length)).map((column) => column.label))];
    const newSamples = [...new Set(["Select all", ...samples])];

    const filterForSamplesChoice = {
        name: "samples",
        label: "Samples to be compared",
        type: "multi-select",
        values: samples
    };

    const renderForm = (
        <div className="button-container-col">
            <h2>Generate statistics on the incomplete dataset</h2>
            <StatisticsAdFirstPlot data={data} options={optionsForProteinsComparison}/>
            <StatisticsAdSecondPlot samplesFilter={filterForSamplesChoice}/>
            <StatisticsAdThirdPlot />
            <StatisticsAdFourthPlot/>
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
