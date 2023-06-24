import React from "react";
import axios from "axios";

export const handleOptionChange = (option, value, selectedOptions, setSelectedOptions) => {
    setSelectedOptions({...selectedOptions, [option]: value});
};

export const renderErrorMessage = (name, errorMessages) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
    );

export const labelAndDropdownGroupWithSpace = (option, selectedOptions, setSelectedOptions) => (
    <div className="label-field-group-with-space">
        <label className="label-statistics">{option.label}</label>
        <select className="input-for-statistics-ad-select"
                value={selectedOptions[option.name]}
                onChange={(e) => handleOptionChange(option.name, e.target.value, selectedOptions, setSelectedOptions)}
        >
            {option.values.map((value) => (
                <option key={value} value={value}>
                    {value}
                </option>
            ))}
        </select>
    </div>
);

export const getClassNameForColumnHeader = (columnHeader) => {
    const selectedOptionsForTable = JSON.parse(localStorage.getItem('selectedOptions'))
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

// export const mapCellsToHighlightMissingData = (data, markedData) => {
//     return data.rows.map((row, indexRow) => (
//         <tr key={indexRow}>
//             {data.columns.map((column, indexCol) => (
//                     <React.Fragment key={indexCol}>
//                         {(markedData.rows[indexRow][column.label] === true) ?
//                             <td className="text-color-zero-imputation">{data.rows[indexRow][column.label]}</td>
//                             :
//                             <td className="text-color-non-zero-imputation">{data.rows[indexRow][column.label]}</td>}
//                     </React.Fragment>
//                 )
//             )}
//         </tr>
//     ))
// }

export const mapCellsToHighlightMissingData = (rows, columns, markedData) => {
    return rows.map((row, indexRow) => (
        <tr key={indexRow}>
            {columns.map((column, indexCol) => (
                    <React.Fragment key={indexCol}>
                        {(markedData.rows[indexRow][column.label] === true) ?
                            <td className="text-color-zero-imputation">{rows[indexRow][column.label]}</td>
                            :
                            <td className="text-color-non-zero-imputation">{rows[indexRow][column.label]}</td>}
                    </React.Fragment>
                )
            )}
        </tr>
    ))
}

export const sendRequestForPlot = (path, selectedOptions, setImageUrl) => {
    axios
        .post("http://localhost:8000/" + path, JSON.stringify(selectedOptions), {
            responseType: "arraybuffer"
        })
        .then((response) => {
            console.info(response);
            setImageUrl(URL.createObjectURL(new Blob([response.data], {type: 'image/png'})))
        })
        .catch((error) => {
            console.error("There was an error!", error.response.data.message)
        });
}