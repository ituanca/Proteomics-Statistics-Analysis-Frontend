import {useEffect, useState} from "react";

export function useStateSS(key, initialValue){
    const [rawState, setRawState] = useState(() => {
        const value = sessionStorage.getItem(key);
        return value !== null ? JSON.parse(value) : initialValue;
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(rawState));
    },[key, rawState]);

    function setState(value){
        setRawState(value);
    }

    return [rawState, setState];
}