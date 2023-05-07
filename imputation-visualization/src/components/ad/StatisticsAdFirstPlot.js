import React from "react";
import FunctionsForProteinsSelectionPlot from "./FunctionsForProteinsSelectionPlot";

export default function StatisticsAdFirstPlot({data}){

   const path = "http://localhost:8000/requestAdChart";
   return (
       <FunctionsForProteinsSelectionPlot data={data} path={path}/>
   );
}
