import React, { createContext, useState, useContext } from 'react'

import {EntriesValues,ValuesValues,Balance, ValuesItem} from "../interfaces"

const resultsDBStatesContext = createContext({});

export default function ResultsDBStatesProvider({children}:any){
    // interfaces
 
    const [entries, setEntries] = useState<EntriesValues[]>([])
    const [nextEntries, setNextEntries] = useState<EntriesValues[]>([])
    const [nextEntries2, setNextEntries2] = useState<EntriesValues[]>([])
    const [valuesList, setValuesList] = useState<ValuesValues[]>([])
    const [balance, setBalance] = useState<Balance[]>([])
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
                nextEntries, setNextEntries,
                nextEntries2, setNextEntries2,
                valuesList, setValuesList,
                balance, setBalance,
                valuesArray, setValuesArray
            }}
        >
            {children}
        </resultsDBStatesContext.Provider>
    )
}

export function useResultsDB(){
    const context = useContext(resultsDBStatesContext);
    const { entries, setEntries, nextEntries, setNextEntries,nextEntries2, setNextEntries2,valuesList, setValuesList,balance, setBalance, valuesArray, setValuesArray}: any = context
    return {entries, setEntries, nextEntries, setNextEntries,nextEntries2, setNextEntries2,valuesList, setValuesList,balance, setBalance, valuesArray, setValuesArray};
}