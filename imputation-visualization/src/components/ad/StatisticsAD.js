import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import StatisticsAdFirstPlot from "./StatisticsAdFirstPlot";
import StatisticsAdSecondPlot from "./StatisticsAdSecondPlot";
import StatisticsAdThirdPlot from "./StatisticsAdThirdPlot";
import StatisticsAdFourthPlot from "./StatisticsAdFourthPlot";
import ImputationMethodChoice from "./ImputationMethodChoice";
import Accordion from './Accordion';
import "./Accordion.css"
import StatisticsAdFifthPlot from "./StatisticsAdFifthPlot";

export default function StatisticsAD({ data }){

    const samples = [...new Set((data.columns.slice(2,(data.columns).length)).map((column) => column.label))];
    const newSamples = [...new Set(["Select all", ...samples])];

    const filterForSamplesChoice = {
        name: "samples",
        label: "Samples to be compared",
        type: "multi-select",
        values: samples
    };

    const accordionDataIncompleteDataset = [
        {
            title: 'Compare up to 5 proteins according to a metric ',
            content: <StatisticsAdFirstPlot data={data}/>
        },
        {
            title: 'Compare the number of missing values for the selected samples ',
            content: <StatisticsAdSecondPlot samplesFilter={filterForSamplesChoice}/>
        },
        {
            title: 'Compare the number/percentage of missing values for each sample by gender ',
            content: <StatisticsAdThirdPlot/>
        },
        {
            title: 'Compare the missing values distribution for each gender ',
            content: <StatisticsAdFourthPlot/>
        }
    ];

    const accordionDataPerformImputation = [
        {
            title: 'View the normalized incomplete dataset and perform imputation with the preferred method ',
            content: <ImputationMethodChoice/>
        }
    ];

    const accordionDataImputedDataset = [
        {
            title: 'Compare up to 5 proteins according to a metric before and after imputation',
            content: <StatisticsAdFifthPlot data={data}/>
        },
    ];

    const renderForm = (
        // <div className="button-container-col">
        //     <h2>Generate statistics on the incomplete dataset</h2>
        //     <StatisticsAdFirstPlot data={data}/>
        //     <StatisticsAdSecondPlot samplesFilter={filterForSamplesChoice}/>
        //     <StatisticsAdThirdPlot/>
        //     <StatisticsAdFourthPlot/>
        //     <h2>Perform imputation</h2>
        //     <ImputationMethodChoice/>
        //     <h2>Generate statistics on the dataset after imputation</h2>
        // </div>

        <div className="accordion">
            <h2>Generate statistics on the incomplete dataset</h2>
            {accordionDataIncompleteDataset.map(({ title, content }) => (
                <Accordion title={title} content={content} />
            ))}
            <h2>Perform imputation</h2>
            {accordionDataPerformImputation.map(({ title, content }) => (
                <Accordion title={title} content={content} />
            ))}
            <h2>Generate statistics on the dataset after imputation</h2>
            {accordionDataImputedDataset.map(({ title, content }) => (
                <Accordion title={title} content={content} />
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
