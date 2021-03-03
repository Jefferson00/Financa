import React, {createContext, useState, ReactNode, useEffect, useRef} from 'react';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';

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

interface EntriesValuesData{
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

    function updateLoadAction(){
        setIsValuesUpdated(!isValuesUpdated)
    }
    

    const [allEntries, setAllEntries] = useState<EntriesData[]>([])
    const [entriesValuesByDate, setEntriesValuesByDate] = useState<EntriesValuesData[]>([])
    const [allEntriesValues, setAllEntriesValues] = useState<EntriesValuesData[]>([])

    const [latestEntries, setLatestEntries] = useState<LatestEntries[]>([])

    function loadAllEntriesResults(){ 
        entriesDB.all().then((res:any)=>{
            setAllEntries(res._array)
            if(res._array.length > allEntries.length){
                setIsValuesUpdated(!isValuesUpdated)
                console.log("Carregou todas as entradas")
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    function loadEntriesValuesByDate(){
        valuesDB.findByDate(202103).then((res:any)=>{
            setEntriesValuesByDate(res._array)
        }).catch(err=>{
            console.log(err)
        })
    }

    function loadAllEntriesValuesResults(){
        valuesDB.all().then((res:any)=>{
            setAllEntriesValues(res._array)
            if(res._array.length > allEntriesValues.length){
                setIsValuesUpdated(!isValuesUpdated)
                console.log("carregou todos os valores")
                console.log("    "+res._array[0].type)
                console.log("    "+res._array[0].received)
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
                    console.log("Valor: "+totalValues)
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


    useEffect(()=>{
        loadAllEntriesResults()
        loadAllEntriesValuesResults()
        loadEntriesValuesByDate()
        setLatestTransations()
        console.log("isValuesUpdated: "+isValuesUpdated)
    },[isValuesUpdated])

    return(
        <DataBDContext.Provider value={{
            allEntries,
            allEntriesValues,
            latestEntries,
            entriesValuesByDate,
            loadAllEntriesResults,
            loadAllEntriesValuesResults,
            updateLoadAction,
        }}>
            {children}
        </DataBDContext.Provider>
    )
}