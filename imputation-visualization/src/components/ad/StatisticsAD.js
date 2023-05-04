import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import StatisticsAdFirstPlot from "./StatisticsAdFirstPlot";
import StatisticsAdSecondPlot from "./StatisticsAdSecondPlot";
import StatisticsAdThirdPlot from "./StatisticsAdThirdPlot";
import StatisticsAdFourthPlot from "./StatisticsAdFourthPlot";
import ImputationMethodChoice from "./ImputationMethodChoice";


export default function StatisticsAD({ data }){

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
            <StatisticsAdFirstPlot data={data}/>
            <StatisticsAdSecondPlot samplesFilter={filterForSamplesChoice}/>
            <StatisticsAdThirdPlot/>
            <StatisticsAdFourthPlot/>
            <h2>Perform imputation</h2>
            <ImputationMethodChoice/>
            <h2>Generate statistics on the dataset after imputation</h2>
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
