import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import dates from '../services/dates';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';
import Functions from "../utils"
import { MainContext } from './mainContext';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
import latestDB from '../services/latestDB';

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
    month:number,
    type: string,
    category:string,
    amount: number,
}

interface DataBDContextData{
    allEntries: EntriesData[];
    allEntriesValues: EntriesValuesData[];
    latestEntries: LatestEntries[];
    entriesValuesByDate: EntriesValuesData[];
    entriesByDate: EntriesData[];
    entriesByCurrentDate: EntriesData[];
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
    const {currentYear, selectedMonth, initialDate, currentMonth, todayDate} = useContext(MainContext)

    const [balances, setBalances] = useState<BalanceData[]>([])
    const [allEntries, setAllEntries] = useState<EntriesData[]>([])
    const [entriesByDate, setEntriesByDate] = useState<EntriesData[]>([])
    const [entriesByCurrentDate, setEntriesByCurrentDate] = useState<EntriesData[]>([])
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
        setIsEntriesDone(false)
        entriesDB.all().then((res:any)=>{
            setAllEntries(res._array)
            setIsEntriesDone(true)
            if(res._array.length != allEntries.length){
                setIsValuesUpdated(!isValuesUpdated)
                console.log("loadAllEntriesResults ----  setIsValuesUpdated")
                //console.log("loadAllEntriesResults")
            }
        }).catch(err=>{
            console.log(err)
            setIsEntriesDone(true)
            console.log("err entradas")
        })
    }

    function loadNotifications(){
       if (entriesByCurrentDate.length > 0){
            dates.findByDate((todayDate.getMonth()+1),todayDate.getFullYear()).then(() => {
                console.log('loadNotifications ---- já existe')
            }).catch(err => {
                const DateObj = {
                    day:todayDate.getDate(),
                    month: todayDate.getMonth()+1,
                    year: todayDate.getFullYear(),
                }
                dates.create(DateObj)
                let thereAreLateEarnings = false
                let thereAreLateExpanses = false
                entriesByCurrentDate.map((entrie, index)=>{
                    if(entrie.day <= todayDate.getDate() && !entrie.received && entrie.type == "Ganhos"){
                        thereAreLateEarnings = true
                        //schedulePushNotification(entrie.title, new Date())
                    }
                    if(entrie.day <= todayDate.getDate() && !entrie.received && entrie.type == "Despesas"){
                        thereAreLateExpanses = true
                        //schedulePushNotification(entrie.title, new Date())
                    }
                    if(!entrie.received){ 
                        schedulePushNotification(entrie.title, 'Você possui um(a)'+entrie.type+' próximo do vencimento!', 10*(index+1), entrie.day)
                    }
                })
                thereAreLateEarnings && schedulePushNotification2('Ganhos não recebidos', 'Você possui ganhos para receber', 60* 60)
                thereAreLateExpanses && schedulePushNotification2('Despesas não pagas', 'Você possui despesas com o pagamento atrasado', 60* 60)
            })
       }
    }

    async function cancelScheduleNotification(indentifier: string) {
        await Notifications.cancelScheduledNotificationAsync(indentifier)
    }

    const schedulePushNotification = async (title: string, body: string, seconds:number, day:number) => {
        const trigger = new Date()
        trigger.setDate(day)
        trigger.setHours(16)
        trigger.setMinutes(32)
        trigger.setSeconds(0)
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
              title: title,
              body: body,
              data: {
              //more data here
              }
            },
            trigger
      
        })
        console.log('identifier: '+identifier)
        console.log('trigger: '+trigger)
        //cancelScheduleNotification(identifier)
    };

      const schedulePushNotification2 = async (title: string, body: string, seconds:number) => {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
              title: title,
              body: body,
              data: {
              //more data here
              }
            },
          trigger: {
            repeats: true,
            seconds: seconds,
          },
      
        })
        console.log('identifier: '+identifier)
        //cancelScheduleNotification(identifier)
      };

    function loadEntriesValuesByDate(){
        valuesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesValuesByDate(res._array)
            console.log('loadEntriesValuesByDate ---- ok')
        }).catch(err=>{
            console.log(err)
            console.log('loadEntriesValuesByDate ---- erro')
            setEntriesValuesByDate([])
        })
    }

    function loadEntriesByDate(){
        
        entriesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesByDate(res._array)
            console.log('loadEntriesByDate ---- ok')
            
        }).catch(err=>{
            console.log(err)
            console.log('loadEntriesByDate ---- erro')
            setEntriesByDate([])
           
        })
    }

    function loadEntriesByCurrentDate(){
        let currentDate
        if (currentMonth < 10) {
            currentDate = currentYear.toString() + '0' + currentMonth.toString()
        } else {
            currentDate = currentYear.toString() + currentMonth.toString()
        }
        setEntriesByCurrentDate([])
        entriesDB.findByDate(parseInt(currentDate)).then((res:any)=>{
            console.log('loadEntriesByCurrentDate ---- ok')
            setEntriesByCurrentDate(res._array)
        }).catch(err=>{
            console.log(err)
            console.log('loadEntriesByCurrentDate ---- erro')
            setEntriesByCurrentDate([])
        })
    }

    function loadAllEntriesValuesResults(){
        valuesDB.all().then((res:any)=>{
            setAllEntriesValues(res._array)
            if(res._array.length != allEntriesValues.length){
                //setIsValuesUpdated(!isValuesUpdated)
                console.log('loadAllEntriesValuesResults ---- ok')
            }
        }).catch(err=>{
            console.log(err)
            console.log('loadAllEntriesValuesResults ---- erro')
        })
    }

    function setLatestTransations(){
        latestDB.all().then((res:any)=>{
            setLatestEntries(res._array)
        })
    }

    function saveLatestTransation(ltsEntriesArray: LatestEntries[], id:string | undefined){
                let totalValues = 0
                allEntriesValues.map((value:EntriesValuesData) => {
                    if (Number(id) === value.entries_id){
                        totalValues = totalValues + value.amount
                    }
                })
                entriesDB.findById(Number(id)).then((res:any)=>{
                    let ltsEntriesObj = {
                        title: res._array[0].title,
                        day: res._array[0].day,
                        month:3,
                        type: res._array[0].type,
                        amount: totalValues,
                    }
                    //ltsEntriesArray.push(ltsEntriesObj)
                })       
    }

    async function getData (){
        try {
            const value = await AsyncStorage.getItem('latestEntries')
            if(value !== null){
                console.log(value)
                return value
            }else{
            }
        } catch (error) {
        }
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
            //console.log("carregou as datas")
            loadBalance()
        }).catch(err=>{
            setIsBalancesDone(true)
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
                //console.log(err)
                let year = parseInt(Functions.toMonthAndYear(data).year)
                let month = parseInt(Functions.toMonthAndYear(data).month)
                let obj: any = { month: month, year: year, amount: sumBalance }
                if (balanceArray.indexOf(obj) > -1) {

                } else {
                  balanceArray.push(obj)
                }
            })
        }
       // console.log("carregou os saldos")
        setBalances(balanceArray)
        balanceArray = []
        setIsBalancesDone(true)
    }

  
    useEffect(()=>{
        loadAllEntriesResults()
        
        
        
        
        
        loadNotifications()

        //console.log("teste: ")
    },[isValuesUpdated])

    useEffect(()=>{
        loadAllEntriesValuesResults()
        setLatestTransations()
        loadEntriesByCurrentDate()
    },[allEntries])

    useEffect(()=>{
        
    },[allEntries, allEntriesValues])
    
    useEffect(()=>{
       
    },[allEntries])

    useEffect(()=>{
        loadEntriesValuesByDate()
    },[allEntriesValues, selectedMonth])

    useEffect(()=>{
        loadEntriesByDate()
    },[selectedMonth, isValuesUpdated])

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
            entriesByCurrentDate,
            loadAllEntriesResults,
            loadAllEntriesValuesResults,
            updateLoadAction,
        }}>
            {children}
        </DataBDContext.Provider>
    )
}