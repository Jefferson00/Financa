import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';
import Functions from "../utils"
import { MainContext } from './mainContext';

interface EntriesData{
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
}

interface BalanceData{
    month:number,
    year:number,
    amount: number
}

interface EntriesValuesData{
    id:number,
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
}

interface LatestEntries{
    title: string,
    day: number,
    entrieDtStart: number,
    entrieDtEnd: number,
    type: string,
    amount: number,
}

interface DataBDContextData{
    allEntries: EntriesData[];
    allEntriesValues: EntriesValuesData[];
    latestEntries: LatestEntries[];
    entriesValuesByDate: EntriesValuesData[];
    entriesByDate: EntriesData[];
    balances: BalanceData[];
    isBalancesDone:boolean;
    isEntriesDone:boolean;
    loadAllEntriesResults: () => void;
    loadAllEntriesValuesResults: () => void;
    updateLoadAction: () => void;

}

interface DataBDProviderProps{
    children: ReactNode;
}


export const DataBDContext = createContext({} as DataBDContextData)

export function DataBDProvider({children}: DataBDProviderProps){

    const [isValuesUpdated, setIsValuesUpdated] = useState(false)
    const {currentYear, selectedMonth, initialDate} = useContext(MainContext)

    const [balances, setBalances] = useState<BalanceData[]>([])
    const [allEntries, setAllEntries] = useState<EntriesData[]>([])
    const [entriesByDate, setEntriesByDate] = useState<EntriesData[]>([])
    const [entriesValuesByDate, setEntriesValuesByDate] = useState<EntriesValuesData[]>([])
    const [allEntriesValues, setAllEntriesValues] = useState<EntriesValuesData[]>([])
    const [latestEntries, setLatestEntries] = useState<LatestEntries[]>([])

    const [isBalancesDone, setIsBalancesDone] = useState(false)
    const [isEntriesDone, setIsEntriesDone] = useState(false)
    
    let DatasArray : any = []
    
    function updateLoadAction(){
        setIsValuesUpdated(!isValuesUpdated)
    }
    
    function loadAllEntriesResults(){ 
        entriesDB.all().then((res:any)=>{
            setAllEntries(res._array)
            if(res._array.length != allEntries.length){
                setIsValuesUpdated(!isValuesUpdated)
                console.log("Carregou todas as entradas")
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    function loadEntriesValuesByDate(){
        valuesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesValuesByDate(res._array)
            console.log("Carregou todas as entradas da data::  "+initialDate)
        }).catch(err=>{
            console.log(err)
            setEntriesValuesByDate([])
        })
    }

    function loadEntriesByDate(){
        setIsEntriesDone(false)
        entriesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesByDate(res._array)
            console.log("Carregou todos os valores da data::  "+initialDate)
            setIsEntriesDone(true)
        }).catch(err=>{
            console.log(err)
            setEntriesByDate([])
            setIsEntriesDone(true)
        })
    }

    function loadAllEntriesValuesResults(){
        valuesDB.all().then((res:any)=>{
            setAllEntriesValues(res._array)
            if(res._array.length != allEntriesValues.length){
                setIsValuesUpdated(!isValuesUpdated)
                console.log("carregou todos os valores")
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    function setLatestTransations(){
        const ltsEntries = allEntries.slice(Math.max(allEntries.length - 3, 0))
        let ltsEntriesArray : LatestEntries[] = [] 
        ltsEntries.map((entr: EntriesData, index: number) => {
            let totalValues = 0
            allEntriesValues.map((value:EntriesValuesData) => {
                if (ltsEntries[index].id === value.entries_id){
                    totalValues = totalValues + value.amount
                }
            })
            let ltsEntriesObj = {
                title: entr.title,
                day: entr.day,
                entrieDtStart: entr.dtStart,
                entrieDtEnd: entr.dtEnd,
                type: entr.type,
                amount: totalValues,
            }
            ltsEntriesArray.push(ltsEntriesObj)
        })
        console.log("carregou as ultimas transações")
        setLatestEntries(ltsEntriesArray)
    }

    function defineDates(){
        valuesDB.allOrderByDate().then((res: any) => {
            let firstDtStart = res._array[0].dtStart
            let year: number = parseInt(Functions.toMonthAndYear(firstDtStart).year)
            let month: number = parseInt(Functions.toMonthAndYear(firstDtStart).month)
            let progressiveDate

            do {
                for (var i = month; i <= 13; i++) {
                  if (i == 13) {
                    month = 1
                    year = year + 1
                  } else {
                    if (i < 10) {
                        progressiveDate = year.toString() + '0' + i.toString()
                    } else {
                        progressiveDate = year.toString() + i.toString()
                    }
                    DatasArray.push(progressiveDate)
                  }
                }
               
            } while (year < currentYear + 5)
            console.log("carregou as datas")
            loadBalance()
        })
        DatasArray = []
    }

    async function loadBalance() {
        let sumBalance = 0
        let balanceArray : any = []
        setBalances([])

        for (const [index, data] of DatasArray.entries()){
            await valuesDB.findByDate(parseInt(data)).then((res:any)=>{
                let sumEarnings = 0
                let sumExpenses = 0
                for (var t = 0; t < res._array.length; t++) {
                    if (res._array[t].type == 'Ganhos') {
                      sumEarnings = sumEarnings + res._array[t].amount
                    } else if (res._array[t].type == 'Despesas') {
                      sumExpenses = sumExpenses + res._array[t].amount
                    }
                }
                let balance = sumEarnings - sumExpenses
                sumBalance = sumBalance + balance 
                let year = parseInt(Functions.toMonthAndYear(data).year)
                let month = parseInt(Functions.toMonthAndYear(data).month)
                let obj: any = { month: month, year: year, amount: sumBalance }
                if (balanceArray.indexOf(obj) > -1) {

                } else {
                  balanceArray.push(obj)
                }
            }).catch(err => {
                console.log(err)
                let year = parseInt(Functions.toMonthAndYear(data).year)
                let month = parseInt(Functions.toMonthAndYear(data).month)
                let obj: any = { month: month, year: year, amount: sumBalance }
                if (balanceArray.indexOf(obj) > -1) {

                } else {
                  balanceArray.push(obj)
                }
            })
        }
        console.log("carregou os saldos")
        setBalances(balanceArray)
        balanceArray = []
        setIsBalancesDone(true)
    }

  
    useEffect(()=>{
        loadAllEntriesResults()
        loadAllEntriesValuesResults()
        loadEntriesValuesByDate()
        loadEntriesByDate()
        setLatestTransations()
        //console.log("isValuesUpdated: "+isValuesUpdated)
    },[isValuesUpdated, selectedMonth])

    useEffect(()=>{
      defineDates()
    },[isValuesUpdated])

    return(
        <DataBDContext.Provider value={{
            allEntries,
            allEntriesValues,
            latestEntries,
            entriesValuesByDate,
            entriesByDate,
            balances,
            isBalancesDone,
            isEntriesDone,
            loadAllEntriesResults,
            loadAllEntriesValuesResults,
            updateLoadAction,
        }}>
            {children}
        </DataBDContext.Provider>
    )
}