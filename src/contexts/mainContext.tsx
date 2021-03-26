import AsyncStorage from '@react-native-community/async-storage';
import React, {createContext, useState, ReactNode, useEffect} from 'react';
import Functions from "../utils"

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
    handleNextMonth: () =>void;
    handlePrevMonth: () =>void;
    resetDate: () =>void;
    
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
        if (currentMonth < 10) {
            setInitialDate(currentYear.toString() + '0' + currentMonth.toString())
        } else {
            setInitialDate(currentYear.toString() + currentMonth.toString())
        }
    }

    async function getSeeBalanceValues (){
        try {
            const value = await AsyncStorage.getItem('SeeBalanceValues')
            if(value !== null){
                return value
            }else{
            }
        } catch (error) {
        }
    }

    function resetDate(){
        setSelectedMonth(currentMonth)
        setSelectedYear(currentYear)
        updateInitialDate()
    }

    function handleNextMonth(){
        let nextDate = Functions.nextMonth(selectedMonth,selectedYear)
        setSelectedMonth(nextDate.nextMonth)
        setSelectedYear(nextDate.nextYear)
        setInitialDate(nextDate.dt)
    }

    function handlePrevMonth(){
        let prevDate = Functions.prevMonth(selectedMonth,selectedYear)
        setSelectedMonth(prevDate.prevMonth)
        setSelectedYear(prevDate.prevYear)
        setInitialDate(prevDate.dt)
    }

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
        let stringSeeBalanceValues = String(!seeBalanceValues)
        storeSeeBalanceValues(stringSeeBalanceValues)
    }

    async function storeSeeBalanceValues (value:string) {
        try {
            await AsyncStorage.setItem('SeeBalanceValues', value)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        updateInitialDate()
        let item = getSeeBalanceValues()
        item.then((stringSeeBalanceValues)=>{
            stringSeeBalanceValues == "true" ? setSeeBalanceValues(true) : setSeeBalanceValues(false)
        })
    },[])

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
            handleNextMonth,
            handlePrevMonth,
            resetDate,
        }}>
            {children}
        </MainContext.Provider>
    )
}