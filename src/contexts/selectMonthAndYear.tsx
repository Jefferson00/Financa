import React, { createContext, useState, useContext } from 'react'

const SelectedMonthAndYearContext = createContext({});

export default function SelectedMonthAndYearProvider({children}:any){
    const [selectedMonth, setSelectedMonth] = useState(10);
    const [selectedYear, setSelectedYear] = useState(2020);
    const [noBalance, setNoBalance] = useState(false)
    const [selectedTotalValues, setSelectedTotalValues] = useState(0)

    return(
        <SelectedMonthAndYearContext.Provider 
            value={{
                selectedMonth,
                setSelectedMonth,
                selectedYear,
                setSelectedYear,
                noBalance, setNoBalance,
                selectedTotalValues, setSelectedTotalValues
            }}
        >
            {children}
        </SelectedMonthAndYearContext.Provider>
    )
}

export function useSelectedMonthAndYear(){
    const context = useContext(SelectedMonthAndYearContext);
    const {selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, noBalance, setNoBalance, selectedTotalValues, setSelectedTotalValues}: any = context
    return {selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, noBalance, setNoBalance, selectedTotalValues, setSelectedTotalValues};
}