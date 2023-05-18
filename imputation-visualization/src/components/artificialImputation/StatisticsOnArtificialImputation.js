import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {truncateText} from "../uploadDataset/FunctionsForEntrySelectionPlot";

export default function StatisticsOnArtificialImputation({listOfImputedTables}){

    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))

    const getClassNameForColumnHeader = (columnHeader) => {
        if(selectedOptionsForTable.class1.includes(columnHeader.label)){
            return "column-header-class1"
        }else if(selectedOptionsForTable.class2.includes(columnHeader.label)){
            return "column-header-class2"
        }else if(selectedOptionsForTable.other_columns.includes(columnHeader.label)){
            return "column-header-other-columns";
        }else if(selectedOptionsForTable.id === columnHeader.label){
            return "column-header-id";
        }
        return "column-header-other-columns";
    }

    return (
        <div>
            {listOfImputedTables.map((table) =>
                <div className="table-position">
                    <div className="table-position-background">
                        <MDBTable scrollY maxHeight="400px">
                            <MDBTableHead>
                                <tr>
                                    {table.columns.map((columnHeader, index) => (
                                        <th key={index} className={getClassNameForColumnHeader(columnHeader)}>{columnHeader.label}</th>
                                    ))}
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody rows={table.rows}/>
                        </MDBTable>
                    </div>
                </div>
            )}
        </div>
    );
}
