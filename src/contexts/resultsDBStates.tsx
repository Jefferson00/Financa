import React, { createContext, useState, useContext } from 'react'

import {EntriesValues,ValuesValues,Balance, ValuesItem, ValuesItemUpdate} from "../interfaces"

const resultsDBStatesContext = createContext({});

export default function ResultsDBStatesProvider({children}:any){

    const [entries, setEntries] = useState<EntriesValues[]>([])
    const [mainEntries, setMainEntries] = useState<EntriesValues[]>([])
    const [nextEntries, setNextEntries] = useState<EntriesValues[]>([])
    const [nextMonthEntries, setNextMonthEntries] = useState<EntriesValues[]>([])
    const [valuesList, setValuesList] = useState<ValuesValues[]>([])
    const [balance, setBalance] = useState<Balance[]>([])
    const [valuesUpdate, setValuesUpdate] = useState<ValuesItemUpdate[]>([])
    const [frequencys, setFrequencys] = useState([])
    const [valueFrequency, setValueFrequency] = useState(1);
    const [valuesArray, setValuesArray] = useState<ValuesItem[]>([{
        id: 0,
        description: '',
        amount: '0',
        monthly: false,
        repeat: 1
    }])

    return(
        <resultsDBStatesContext.Provider 
            value={{
                entries, setEntries,
                mainEntries, setMainEntries,
                nextEntries, setNextEntries,
                nextMonthEntries, setNextMonthEntries,
                valuesList, setValuesList,
                balance, setBalance,
                valuesArray, setValuesArray,
                valuesUpdate, setValuesUpdate,
                frequencys, setFrequencys,
                valueFrequency, setValueFrequency
            }}
        >
            {children}
        </resultsDBStatesContext.Provider>
    )
}

export function useResultsDB(){
    const context = useContext(resultsDBStatesContext);
    const {
         entries, 
         setEntries,
         mainEntries, 
         setMainEntries, 
         nextEntries, 
         setNextEntries,
         nextMonthEntries, 
         setNextMonthEntries,
         valuesList, 
         setValuesList,
         balance, 
         setBalance, 
         valuesArray, 
         setValuesArray,
         valuesUpdate,
         setValuesUpdate,
         frequencys, 
         setFrequencys,
         valueFrequency, 
         setValueFrequency
        }: any = context
    return {
        entries, 
        setEntries, 
        mainEntries, 
        setMainEntries,
        nextEntries, 
        setNextEntries,
        nextMonthEntries, 
        setNextMonthEntries,
        valuesList, 
        setValuesList,
        balance, 
        setBalance, 
        valuesArray, 
        setValuesArray,
        valuesUpdate,
        setValuesUpdate,
        frequencys, 
        setFrequencys,
        valueFrequency, 
        setValueFrequency
    };
}