function handleSelectionsCorrelation(option, value, crtId, crtName, selectedOptions, setSelectedOptions, options, data) {
    if(value !== "-- Select an option --"){
        if(option === crtId){
            const nameOption = options.find((option) => option.name === crtName)
            const correspondingName = data.rows.find((d) => d["Majority.protein.IDs"] === value)["Protein.names"];
            setSelectedOptions({ ...selectedOptions, [option]: value, [nameOption.name]: correspondingName });
        }else if(option === crtName){
            const idOption = options.find((option) => option.name === crtId)
            const correspondingId = data.rows.find((d) => d["Protein.names"] === value)["Majority.protein.IDs"];
            setSelectedOptions({...selectedOptions, [option]: value, [idOption.name]: correspondingId});
        }
    }else{
        if(option === crtId){
            const nameOption = options.find((option) => option.name === crtName)
            setSelectedOptions({ ...selectedOptions, [option]: "", [nameOption.name]: ""});
        }else if(option === crtName){
            const idOption = options.find((option) => option.name === crtId)
            setSelectedOptions({...selectedOptions, [option]: "", [idOption.name]: ""});
        }
    }
}

const handleOptionChange = (option, value, selectedOptions, setSelectedOptions, options, data) => {
    setSelectedOptions({...selectedOptions, [option]: value});
    // onChange({ ...selectedOptions, [option]: value });
    handleSelectionsCorrelation(option, value, "protein_id_1", "protein_name_1", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "protein_id_2", "protein_name_2", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "protein_id_3", "protein_name_3", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "protein_id_4", "protein_name_4", selectedOptions, setSelectedOptions, options, data);
    handleSelectionsCorrelation(option, value, "protein_id_5", "protein_name_5", selectedOptions, setSelectedOptions, options, data);
};

const renderErrorMessage = (name, errorMessages) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
    );

export {handleSelectionsCorrelation, handleOptionChange, renderErrorMessage};