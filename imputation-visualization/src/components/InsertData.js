import React, {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import "./InsertData.css"
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

function InsertData(){

    const [incompleteDfNewProgeria, setIncompleteDfNewProgeria] = useState([]);
    const [incompleteDfNewAD, setIncompleteDfNewAD] = useState([])
    const [progeriaSelected, setProgeriaSelected] = useState(false);
    const [adSelected, setAdSelected] = useState(false);

    const [data, setData] = useState( {
        columns: [],
        rows: []
    })

    useEffect(() => {
        if(incompleteDfNewProgeria.length > 0 && progeriaSelected) {
            setData({...data, columns: Object.keys(incompleteDfNewProgeria[0]).map(key => {
                    return {
                        label: key,
                        field: key,
                        sort: 'asc'
                    };
                }), rows: incompleteDfNewProgeria})
        }
       // if(incompleteDfNewProgeria.length > 0) {
       //     setDataProgeria({...dataProgeria, columns: [
       //             {label: "Majority.protein.IDs", field: "Majority.protein.IDs", sort: 'asc'},
       //             {label: "Protein.names", field: "Protein.names", sort: 'asc'},
       //             {label: "Intensity.Pro1_DIA", field: "Intensity.Pro1_DIA", sort: 'asc'},
       //             {label: "Intensity.Pro1_Rep_DIA", field: "Intensity.Pro1_Rep_DIA", sort: 'asc'},
       //             {label: "Intensity.Pro3_DIA", field: "Intensity.Pro3_DIA", sort: 'asc'},
       //             {label: "Intensity.Pro3_Rep_DIA", field: "Intensity.Pro3_Rep_DIA", sort: 'asc'},
       //             {label: "Intensity.WT1_DIA", field: "Intensity.WT1_DIA", sort: 'asc'},
       //             {label: "Intensity.WT1_Rep_DIA", field: "Intensity.WT1_Rep_DIA", sort: 'asc'},
       //             {label: "Intensity.WT3_DIA", field: "Intensity.WT3_DIA", sort: 'asc'},
       //             {label: "Intensity.WT3_Rep_DIA", field: "Intensity.WT3_Rep_DIA", sort: 'asc'},
       //         ], rows: incompleteDfNewProgeria})
       // }
       if(incompleteDfNewAD.length > 0 && adSelected) {
           setData({...data, columns: Object.keys(incompleteDfNewAD[0]).map(key => {
                   return {
                       label: key,
                       field: key,
                       sort: 'asc'
                   };
               }), rows: incompleteDfNewAD})
       }
    }, [incompleteDfNewProgeria, incompleteDfNewAD, progeriaSelected, adSelected])

    const fetchIncompleteDfNewProgeria = () => {
        setProgeriaSelected(true);
        setAdSelected(false);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetProgeria')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewProgeria(json))
            .catch((error) => console.log(error));
        console.log(incompleteDfNewProgeria)
    }

    const fetchIncompleteDfNewAD = () => {
        setProgeriaSelected(false);
        setAdSelected(true);
        fetch('http://localhost:8000/getIncompleteDfNewDatasetAD')
            .then((response) => response.json())
            .then((json) => setIncompleteDfNewAD(json))
            .catch((error) => console.log(error));
        console.log(incompleteDfNewAD)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const buttonClasNameProgeria = progeriaSelected
        ?  "disease-choice-button-selected"
        :  "disease-choice-button" ;

    const buttonClassNameAD = adSelected
        ?  "disease-choice-button-selected"
        :  "disease-choice-button" ;

    const renderForm = (
        <form onSubmit = {handleSubmit}>
            <h2>Choose a dataset</h2>
            <div className="button-container-col">
                <div  className="button-container-row">
                    <div className="input-container-col">
                        <button onClick={fetchIncompleteDfNewProgeria} className={buttonClasNameProgeria}>Progeria dataset</button>
                    </div>

                    <div className="input-container-col">
                        <button onClick={fetchIncompleteDfNewAD} className={buttonClassNameAD} >Alzheimer's disease dataset</button>
                    </div>
                </div>
                {((incompleteDfNewProgeria.length > 0 && progeriaSelected) || (incompleteDfNewAD.length > 0 && adSelected)) ?
                    <div className="table-position">
                        <MDBTable scrollY maxHeight="400px">
                            <MDBTableHead columns={data.columns}/>
                            <MDBTableBody rows={data.rows} />
                        </MDBTable>
                    </div>
                    : null}
                <div className="button-container-row">
                    <div className="input-container-col">
                        <Link to="/">
                            <button className="go-back-button">Go back</button>
                        </Link>
                    </div>
                    <div className="input-container-col">
                        <input type="submit" value="Next"/>
                    </div>
                </div>
            </div>
        </form>
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

export default InsertData;