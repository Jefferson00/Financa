import React, {createContext, useState, ReactNode, useEffect} from 'react';

interface MainContextData{
    isBalanceActive: boolean;
    isEarningsActive: boolean;
    isExpansesActive: boolean;
    seeExpansesValues: boolean;
    seeEarningsValues: boolean;
    seeBalanceValues: boolean;
    todayDate:Date;
    currentMonth:number;
    currentYear:number;
    initialDate:string;
    selectedMonth:number;
    selectedYear:number;
    activeBalanceView: () =>void;
    activeEarningsView: () =>void;
    activeExpansesView: () =>void;
    handleSeeExpansesValues: () =>void;
    handleSeeEarningsValues: () =>void;
    handleSeeBalanceValues: () =>void;
}

interface MainProviderProps{
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextData)

export function MainProvider({children}:MainProviderProps){

    const [isBalanceActive, setIsBalanceActive] = useState(true)
    const [isEarningsActive, setIsEarningsActive] = useState(false)
    const [isExpansesActive, setIsExpansesActive] = useState(false)

    const [seeExpansesValues, setSeeExpansesValues] = useState(true)
    const [seeEarningsValues, setSeeEarningsValues] = useState(true)
    const [seeBalanceValues, setSeeBalanceValues] = useState(true)

    const [todayDate, setTodayDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth()+1)
    const [currentYear, setCurrentYear] = useState(todayDate.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [initialDate, setInitialDate] = useState('202103')
    
    function updateInitialDate(){
        if (selectedMonth < 10) {
            setInitialDate(selectedYear.toString() + '0' + selectedMonth.toString())
        } else {
            setInitialDate(selectedYear.toString() + selectedMonth.toString())
        }
    }

    useEffect(()=>{
        updateInitialDate()
        console.log("dta inicial: "+initialDate)
    },[])

    function activeBalanceView(){
        setIsBalanceActive(true)
        setIsEarningsActive(false)
        setIsExpansesActive(false)
    }

    function activeEarningsView(){
        setIsBalanceActive(false)
        setIsEarningsActive(true)
        setIsExpansesActive(false)
    }
    function activeExpansesView(){
        setIsBalanceActive(false)
        setIsEarningsActive(false)
        setIsExpansesActive(true)
    }

    function handleSeeExpansesValues(){
        setSeeExpansesValues(!seeExpansesValues)
    }

    function handleSeeEarningsValues(){
        setSeeEarningsValues(!seeEarningsValues)
    }

    function handleSeeBalanceValues(){
        setSeeBalanceValues(!seeBalanceValues)
    }

    return(
        <MainContext.Provider value={{
            isBalanceActive,
            isEarningsActive,
            isExpansesActive,
            seeExpansesValues,
            seeEarningsValues,
            seeBalanceValues,
            todayDate,
            currentMonth,
            currentYear,
            initialDate,
            selectedMonth,
            selectedYear,
            activeBalanceView,
            activeEarningsView,
            activeExpansesView,
            handleSeeExpansesValues,
            handleSeeEarningsValues,
            handleSeeBalanceValues,
        }}>
            {children}
        </MainContext.Provider>
    )
}