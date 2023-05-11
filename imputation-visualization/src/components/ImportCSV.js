import React, {useRef, useState} from "react";
import { read, utils, writeFile } from 'xlsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./ImportCSV.css"

export default function ImportCSV () {
    const [importedData, setImportedData] = useState([]);
    const [fileName, setFileName] = useState('');

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setImportedData(rows)
                    setFileName(file.name)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    console.log(importedData)

    const handleExport = () => {
        const headings = [[
            'Movie',
            'Category',
            'Director',
            'Rating'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, importedData, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Movie Report.xlsx');
    }

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <button className="general-button" onClick={handleButtonClick}>Choose File</button>
            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport}
                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            {fileName && <p className="file-name">Selected file: {fileName}</p>}
        </div>
        //     <div className="row mb-2 mt-5">
        //         <div className="col-sm-6 offset-3">
        //             <div className="row">
        //                 <div className="col-md-6">
        //                     <div className="input-group">
        //                         <div className="custom-file">
        //                             <button className="go-back-button" onClick={handleButtonClick}>Choose File</button>
        //                             <input type="file" name="file" className="custom-file-input" id="inputGroupFile" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport}
        //                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        //                             {fileName && <p className="file-name">Selected file: {fileName}</p>}
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="col-md-6">
        //                     <button onClick={handleExport} className="btn btn-primary float-right">
        //                         Export <i className="fa fa-download"/>
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="row">
        //         <div className="col-sm-6 offset-3">
        //             <table className="table">
        //                 <thead>
        //                 <tr>
        //                     <th scope="col">Id</th>
        //                     <th scope="col">Movie</th>
        //                     <th scope="col">Category</th>
        //                     <th scope="col">Director</th>
        //                     <th scope="col">Rating</th>
        //                 </tr>
        //                 </thead>
        //                 <tbody>
        //                 {
        //                     importedData.length
        //                         ?
        //                         importedData.map((movie, index) => (
        //                             <tr key={index}>
        //                                 <th scope="row">{ index + 1 }</th>
        //                                 <td>{ movie.Movie }</td>
        //                                 <td>{ movie.Category }</td>
        //                                 <td>{ movie.Director }</td>
        //                                 <td><span className="badge bg-warning text-dark">{ movie.Rating }</span></td>
        //                             </tr>
        //                         ))
        //                         :
        //                         <tr>
        //                             <td colSpan="5" className="text-center">No Movies Found.</td>
        //                         </tr>
        //                 }
        //                 </tbody>
        //             </table>
        //         </div>
        //     </div>
        // </div>
    );
};

