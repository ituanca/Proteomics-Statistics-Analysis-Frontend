import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import StatisticsOtherFirstPlot from "./StatisticsOtherFirstPlot";
import Accordion from '../Accordion';
import "../Accordion.css"
import StatisticsOtherSecondPlot from "./StatisticsOtherSecondPlot";
import StatisticsOtherThirdPlot from "./StatisticsOtherThirdPlot";
import StatisticsOtherFourthPlot from "./StatisticsOtherFourthPlot";

export default function StatisticsOther(){

    const tableData = JSON.parse(localStorage.getItem('selectedDataset'))
    const samples = [...new Set((tableData.columns.slice(2,(tableData.columns).length)).map((column) => column.label))];

    const filterForSamplesChoice = {
        name: "samples",
        label: "Samples to be compared",
        type: "multi-select",
        values: samples
    };

    const accordionDataIncompleteDataset = [
        {
            title: 'Compare up to 5 entries according to a metric',
            content: <StatisticsOtherFirstPlot/>
        },
        {
            title: 'Compare the number of missing values for the selected samples',
            content: <StatisticsOtherSecondPlot samplesFilter={filterForSamplesChoice}/>
        },
        {
            title: 'Compare the number/percentage of missing values for each sample by class',
            content: <StatisticsOtherThirdPlot/>
        },
        {
            title: 'Compare the missing values distribution for each class',
            content: <StatisticsOtherFourthPlot/>
        }
    ];

    // const accordionDataPerformImputation = [
    //     {
    //         title: 'View the normalized incomplete dataset and perform imputation with the preferred method',
    //         content: <ImputationMethodChoice/>
    //     }
    // ];

    // const accordionDataImputedDataset = [
    //     {
    //         title: 'Compare up to 5 proteins according to a metric before and after imputation',
    //         content: <StatisticsAdFifthPlot/>
    //     },
    // ];

    const renderForm = (
        <div className="accordion">
            <h3>Generate statistics on the incomplete dataset</h3>
            {accordionDataIncompleteDataset.map(({ title, content }, index) => (
                <div key={index}>
                    <Accordion title={title} content={content}/>
                </div>
            ))}
            {/*<h3>Perform imputation</h3>*/}
            {/*{accordionDataPerformImputation.map(({ title, content }, index) => (*/}
            {/*    <div key={index}>*/}
            {/*        <Accordion title={title} content={content} />*/}
            {/*    </div>*/}
            {/*))}*/}
            {/*<h3>Generate statistics on the dataset after imputation</h3>*/}
            {/*{accordionDataImputedDataset.map(({ title, content }, index) => (*/}
            {/*    <div key={index}>*/}
            {/*        <Accordion title={title} content={content} />*/}
            {/*    </div>*/}
            {/*))}*/}
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
