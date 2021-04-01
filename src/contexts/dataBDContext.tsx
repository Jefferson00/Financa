import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';
import Functions from "../utils"
import { MainContext } from './mainContext';
import * as Notifications from 'expo-notifications';
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
    category:string,
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
    entriesByNextMonth: EntriesData[];
    balances: BalanceData[];
    isBalancesDone:boolean;
    isEntriesDone:boolean;
    loadAllEntriesResults: () => void;
    loadAllEntriesValuesResults: () => void;
    updateLoadAction: () => void;
    loadNotifications: () => void;
    loadEntriesByCurrentDate: () => void;

}

interface DataBDProviderProps{
    children: ReactNode;
}


export const DataBDContext = createContext({} as DataBDContextData)

export function DataBDProvider({children}: DataBDProviderProps){

    const {currentYear, selectedMonth, initialDate, currentMonth, todayDate} = useContext(MainContext)

    const [balances, setBalances] = useState<BalanceData[]>([])
    const [allEntries, setAllEntries] = useState<EntriesData[]>([])
    const [entriesByDate, setEntriesByDate] = useState<EntriesData[]>([])
    const [entriesByCurrentDate, setEntriesByCurrentDate] = useState<EntriesData[]>([])
    const [entriesByNextMonth, setEntriesByNextMonth] = useState<EntriesData[]>([])
    const [entriesValuesByDate, setEntriesValuesByDate] = useState<EntriesValuesData[]>([])
    const [allEntriesValues, setAllEntriesValues] = useState<EntriesValuesData[]>([])
    const [latestEntries, setLatestEntries] = useState<LatestEntries[]>([])
    
    const [isValuesUpdated, setIsValuesUpdated] = useState(false)
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
            loadAllEntriesValuesResults()
            setLatestTransations()
            
        }).catch(err=>{
            console.log(err)
            setIsEntriesDone(true)
            defineDates()
            //console.log("err entradas")
        })
    }

    function loadNotifications(){
        cancelAllNotification().then(value=>{
            console.log('cancelado!!!')
        })

        let currentDate
        if (currentMonth < 10) {
            currentDate = currentYear.toString() + '0' + currentMonth.toString()
        } else {
            currentDate = currentYear.toString() + currentMonth.toString()
        }
        setEntriesByCurrentDate([])
        entriesDB.findByDate(parseInt(currentDate)).then((res:any)=>{
            if (res._array.length > 0){
                let thereAreLateEarnings = false
                let thereAreLateExpanses = false
                res._array.map((entrie:any, index:number)=>{
                    if(entrie.day <= todayDate.getDate() && !entrie.received && entrie.type == "Ganhos"){
                        thereAreLateEarnings = true
                    }
                    if(entrie.day <= todayDate.getDate() && !entrie.received && entrie.type == "Despesas"){
                        thereAreLateExpanses = true
                    }
                    if(!entrie.received){ 
                        schedulePushNotification(entrie.title, 'Você possui um(a)'+entrie.type+' próximo do vencimento!',  entrie.day)
                    }
                })
                thereAreLateEarnings && schedulePushNotificationLate('Ganhos não recebidos', 'Você possui ganhos para receber', 60*5, false)
                thereAreLateExpanses && schedulePushNotificationLate('Despesas não pagas', 'Você possui despesas com o pagamento atrasado', 60*5, false)
                thereAreLateEarnings && schedulePushNotificationLate('Ganhos não recebidos', 'Você possui ganhos para receber', 86400, true)
                thereAreLateExpanses && schedulePushNotificationLate('Despesas não pagas', 'Você possui despesas com o pagamento atrasado', 86400, true)
            } 
        }).catch(err=>{
            console.log(err)
     
        })
    }

    async function cancelAllNotification(){
        await Notifications.cancelAllScheduledNotificationsAsync()
    }

    const schedulePushNotification = async (title: string, body: string, day:number) => {
        const trigger = new Date()
        trigger.setDate(day-1)
        trigger.setHours(16)
        trigger.setMinutes(20)
        trigger.setSeconds(0)
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
              title: title,
              body: body,
            },
            trigger
      
        })
        console.log('identifier: '+identifier)
        console.log('trigger: '+trigger)
    };

      const schedulePushNotificationLate = async (title: string, body: string, seconds:number, repeat:boolean) => {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
              title: title,
              body: body,
            },
          trigger: {
            repeats: repeat,
            seconds: seconds,
          },
      
        })
        console.log('identifier: '+identifier)
      };

    function loadEntriesValuesByDate(){
        valuesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesValuesByDate(res._array)
            //console.log('loadEntriesValuesByDate ---- ok')
        }).catch(err=>{
            console.log(err)
            //console.log('loadEntriesValuesByDate ---- erro')
            setEntriesValuesByDate([])
        })
    }

    function loadEntriesByDate(){
        entriesDB.findByDate(parseInt(initialDate)).then((res:any)=>{
            setEntriesByDate(res._array)
            //console.log('loadEntriesByDate ---- ok')
        }).catch(err=>{
            console.log(err)
            //console.log('loadEntriesByDate ---- erro')
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
            //console.log('loadEntriesByCurrentDate ---- ok')
            setEntriesByCurrentDate(res._array)
        }).catch(err=>{
            console.log(err)
            //console.log('loadEntriesByCurrentDate ---- erro')
            setEntriesByCurrentDate([])
        })
    }

    function loadEntriesByNextMonth(){
        let nextDate
        let nextMonth = currentMonth + 1
        let nextYear = currentYear
        if(nextMonth > 12){
            nextMonth = 1
            nextYear = currentYear + 1
        }
        if(nextMonth < 10){
            nextDate = nextYear.toString() + '0' + nextMonth.toString()
        }else{
            nextDate = nextYear.toString() + nextMonth.toString()
        }
        setEntriesByNextMonth([])
        entriesDB.findByDate(parseInt(nextDate)).then((res:any)=>{
            setEntriesByNextMonth(res._array)
        }).catch(err=>{
            console.log(err)
            setEntriesByNextMonth([])
        })
    }

    function loadAllEntriesValuesResults(){
        valuesDB.all().then((res:any)=>{
            setAllEntriesValues(res._array)
            defineDates()
            setIsEntriesDone(true)
        }).catch(err=>{
            console.log(err)
            defineDates()
            setIsEntriesDone(true)
        })
    }

    function setLatestTransations(){
        latestDB.all().then((res:any)=>{
            setLatestEntries(res._array)
        })
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
                   // console.log("progressive date: "+progressiveDate)
                    DatasArray.push(progressiveDate)
                  }
                }
               
            } while (year < currentYear + 5)
            //console.log("carregou as datas")
            loadBalance()
        }).catch(err=>{
            setBalances([])
            setIsBalancesDone(true)
        })
        DatasArray = []
    }

    async function loadBalance() {
        let sumBalance = 0
        let balanceArray : any = []
        setBalances([])

        for (const [index, data] of DatasArray.entries()){
           // console.log('date: '+data)
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
        defineDates()
        loadEntriesByCurrentDate()
        loadEntriesByNextMonth()
        //loadNotifications()

    },[isValuesUpdated])

    useEffect(()=>{
        loadEntriesValuesByDate()
    },[allEntriesValues, selectedMonth])

    useEffect(()=>{
        loadEntriesByDate()
    },[selectedMonth, isValuesUpdated])


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
            entriesByNextMonth,
            loadAllEntriesResults,
            loadNotifications,
            loadAllEntriesValuesResults,
            updateLoadAction,
            loadEntriesByCurrentDate
        }}>
            {children}
        </DataBDContext.Provider>
    )
}