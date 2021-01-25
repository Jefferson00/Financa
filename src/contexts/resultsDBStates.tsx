import React, { createContext, useState, useContext } from 'react'

const resultsDBStatesContext = createContext({});

export default function ResultsDBStatesProvider({children}:any){
    // interfaces
  interface EntriesValues {
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
  }

  interface ValuesValues {
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
  }

  interface Balance {
    month: number,
    year: number,
    amount: number,
  }


    const [entries, setEntries] = useState<EntriesValues[]>([])
    const [nextEntries, setNextEntries] = useState<EntriesValues[]>([])
    const [nextEntries2, setNextEntries2] = useState<EntriesValues[]>([])
    const [valuesList, setValuesList] = useState<ValuesValues[]>([])
    const [balance, setBalance] = useState<Balance[]>([])

    return(
        <resultsDBStatesContext.Provider 
            value={{
                entries, setEntries,
                nextEntries, setNextEntries,
                nextEntries2, setNextEntries2,
                valuesList, setValuesList,
                balance, setBalance
            }}
        >
            {children}
        </resultsDBStatesContext.Provider>
    )
}

export function useResultsDB(){
    const context = useContext(resultsDBStatesContext);
    const { entries, setEntries, nextEntries, setNextEntries,nextEntries2, setNextEntries2,valuesList, setValuesList,balance, setBalance}: any = context
    return {entries, setEntries, nextEntries, setNextEntries,nextEntries2, setNextEntries2,valuesList, setValuesList,balance, setBalance};
}