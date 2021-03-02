import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import { Platform } from 'react-native';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';

import Functions from "../utils"
import { DataBDContext } from './dataBDContext';

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

interface EntriesData{
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
}

interface ValuesData{
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
}

interface NewEntriesContextData{
    calendarDate: Date;
    showCalendar:boolean;
    titleInputEntrie: string;
    isEnabledReceived: boolean,
    isEnabledMonthly: boolean,
    entrieFrequency:number,
    entrieValuesBeforeCreate: ValuesData[];
    typeOfEntrie:string
    onChangeDate: (event: any, selectedDate: any) => void;
    showDatepicker: () => void;
    setTitleInputEntrie: (titleInputEntrie:string) => void;
    toggleSwitchReceived: () => void;
    toggleSwitchMonthly: () => void;
    decreaseEntrieFrequency: () => void;
    increaseEntrieFrequency: () => void;
    updateTypeOfEntrie: (type:string) => void;
    updateEntrieValuesBeforeCreate: (subitem: string, index: number, value: any) => void;
    handleCreateNewEntrie: ()=> void;
}

interface NewEntriesProviderProps{
    children: ReactNode;
}


export const NewEntriesContext = createContext({} as NewEntriesContextData)

export function NewEntriesProvider({children}: NewEntriesProviderProps){

    const {updateLoadAction} = useContext(DataBDContext)

    const [typeOfEntrie, setTypeOfEntrie] = useState('');

    function updateTypeOfEntrie(type:string){
        setTypeOfEntrie(type)
        console.log("Atualizou o tipo da entrada")
    }

    //-------------------------------//
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || calendarDate;
        setShowCalendar(Platform.OS === 'ios');
        setCalendarDate(currentDate);
        console.log("Atualizou a data do calendario")
    };

    const showDatepicker = () => {
        setShowCalendar(true);
    };

    //----------------------//

    const [isEnabledReceived, setIsEnabledReceived] = useState(false);
    const [isEnabledMonthly, setIsEnabledMonthly] = useState(false);

    const toggleSwitchReceived = () => setIsEnabledReceived(previousState => !previousState);

    const toggleSwitchMonthly = () => {
        //seta o switch mensal como true ou false
        setIsEnabledMonthly(previousState => !previousState)
        console.log("Mudou o switch mensal")
    };

    //-------------------------------------//

    const [titleInputEntrie, setTitleInputEntrie] = useState('');
    const [entrieFrequency, setEntrieFrequency] = useState(1);

    function decreaseEntrieFrequency(){
        if(entrieFrequency > 1) setEntrieFrequency(entrieFrequency - 1)
    }

    function increaseEntrieFrequency(){
        setEntrieFrequency(entrieFrequency + 1)
    }

    //----------------------------------------------//

    const initialValue: ValuesData[] = [{
        description: '',
        amount: 0,
        dtStart: 0,
        dtEnd: 0,
        entries_id: 0,
    }]

    const [entrieValuesBeforeCreate, setEntriesValuesBeforeCreate] = useState<ValuesData[]>(initialValue)
    
    function updateEntrieValuesBeforeCreate(subitem: string, index: number, e: any){
            let arrOfEntriesValues = entrieValuesBeforeCreate.map((entrieValue:ValuesData, i:number)=>{
                if (index === i){
                    if (subitem == 'monthly') {
                        return { ...entrieValue, ['dtend']:'209912' }
                    }
                    else if (subitem == 'amount') {
                        var valor = e.nativeEvent.text
                        valor = valor + '';
                        valor = parseInt(valor.replace(/[\D]+/g, ''));
                        valor = valor + '';
                        valor = valor.replace(/([0-9]{2})$/g, ",$1");
                        if (valor.length > 6) {
                            valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
                        }
                        if (valor =="NaN") valor = 0
                        return { ...entrieValue, [subitem]: valor }
                    }
                    else if (subitem == "description"){
                        return { ...entrieValue, [subitem]: e.nativeEvent.text }
                    }
                    else {
                        return { ...entrieValue, [subitem]: e.nativeEvent.text }
                    }
                } else {
                    return entrieValue
                }
            })
            setEntriesValuesBeforeCreate(arrOfEntriesValues)
    }

    function handleCreateNewEntrie(){
        let dtStart = Functions.setDtStart(calendarDate)
        let dtEnd = Functions.setDtEnd(isEnabledMonthly, entrieFrequency, calendarDate)
        console.log("******CADASTRO********** ")
        console.log("data inicial: "+dtStart)
        console.log("data final: "+dtEnd)

        const EntrieObj : EntriesData = {
            title: titleInputEntrie,
            day: calendarDate.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: isEnabledMonthly,
            received: isEnabledReceived,
            type: typeOfEntrie,
        }

        console.log("Objeto: "+EntrieObj)

        entriesDB.create(EntrieObj).then(()=>{
            console.log("Create!")
            alert('cadastrado com sucesso!')
            updateLoadAction()
        }).catch(err=>{
            console.log(err)
        })
        entriesDB.all().then((res:any)=>{
            //console.log(res)

            console.log("All!")
            entrieValuesBeforeCreate.map((value: ValuesData) =>{
                let EntrieId = res._array.slice(-1)[0].id
                let amount = String(value.amount)
                amount = amount.replace(/[.]/g, '')
                amount = amount.replace(/[,]/g, '')
                const ValueObj:ValuesData = {
                    description: value.description,
                    amount: Number(amount),
                    dtStart: dtStart,
                    dtEnd: dtEnd, ///mudar depois
                    entries_id: EntrieId
                }
                valuesDB.create(ValueObj).then(()=>{
                    console.log("Create!")
                    alert('valor cadastrado com sucesso!')
                    updateLoadAction()
                }).catch(err => {
                    console.log(err)
                })
            })
            updateLoadAction()
        }).catch(err => {
            console.log(err)
        })
    }

    return(
        <NewEntriesContext.Provider value={{
            calendarDate,
            showCalendar,
            titleInputEntrie,
            isEnabledReceived,
            isEnabledMonthly,
            entrieFrequency,
            entrieValuesBeforeCreate,
            typeOfEntrie,
            onChangeDate,
            showDatepicker,
            setTitleInputEntrie,
            toggleSwitchReceived,
            toggleSwitchMonthly,
            decreaseEntrieFrequency,
            increaseEntrieFrequency,
            updateEntrieValuesBeforeCreate,
            updateTypeOfEntrie,
            handleCreateNewEntrie,
        }}>
            {children}
        </NewEntriesContext.Provider>
    )
}