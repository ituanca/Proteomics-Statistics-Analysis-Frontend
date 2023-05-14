import React from "react";

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

