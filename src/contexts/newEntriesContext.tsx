import React, {createContext, useState, ReactNode, useContext} from 'react';
import { Platform } from 'react-native';
import functions from '../functions';
import entriesDB from '../services/entriesDB';
import valuesDB from '../services/valuesDB';

import Functions from "../utils"
import { DataBDContext } from './dataBDContext';
import { MainContext } from './mainContext';

interface EntriesByDateData{
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
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
    id:number,
    description: string,
    amount: number,
    monthly: boolean,
    frequency: number,
    entries_id: number,
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

interface NewEntriesContextData{
    calendarDate: Date;
    showCalendar:boolean;
    titleInputEntrie: string;
    isEnabledReceived: boolean,
    isEnabledMonthly: boolean,
    entrieFrequency:number,
    entrieValuesBeforeCreate: ValuesData[];
    typeOfEntrie:string
    entrieIdUpdate:number;
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
    handleUpdate: ()=> void;
    handleDeleteEntrie: (entrieId:number)=> void;
    handleDeleteEntrieValues: (entrieId:number, valueId:number)=> void;
    updateEntrieReceived: (selectedId:number)=> void;
    addNewValueBeforeCreate: (newValue : ValuesData)=> void;
    updateEntrieIdUpdate: (idUpdate:number)=> void;
    setEntrieValuesUpdate: (entrie:any)=> void;
    resetValues: ()=> void;
    setValuesUpdate: (valuesUpdate:EntriesValuesData[])=> void;
}

interface NewEntriesProviderProps{
    children: ReactNode;
}


export const NewEntriesContext = createContext({} as NewEntriesContextData)

export function NewEntriesProvider({children}: NewEntriesProviderProps){

    const {entriesByDate, entriesValuesByDate , updateLoadAction} = useContext(DataBDContext)
    const {selectedYear, selectedMonth} = useContext(MainContext)
    //const {updateEntriesModalVisible} = useContext(StylesContext)

    const [typeOfEntrie, setTypeOfEntrie] = useState('');
    const [entrieIdUpdate, setEntrieIdUpdate] = useState(0);

    const [valuesIsChanged, setValuesIsChanged] = useState(false);

    function setEntrieValuesUpdate(entrie:any){
        setTitleInputEntrie(entrie.title)

        entrie.received == 1 ? setIsEnabledReceived(true) : setIsEnabledReceived(false)
        
        if (entrie.monthly == 1){
            setIsEnabledMonthly(true) 
            setEntrieFrequency(1)
        }else{
            setIsEnabledMonthly(false)
            let frequency = Functions.toFrequency(entrie.dtEnd, entrie.dtStart)+1
            setEntrieFrequency(frequency) 
        }

        let newDate = new Date()
        newDate.setMonth(Number(Functions.toMonthAndYear(entrie.dtStart).month)-1)
        newDate.setFullYear(Number(Functions.toMonthAndYear(entrie.dtStart).year))
        console.log("DIA: "+entrie.day)
        newDate.setDate(entrie.day)
        setCalendarDate(newDate)
    }

    function setValuesUpdate(valuesUpdate:EntriesValuesData[]){
        let valuesBeforeUpdate: ValuesData[] = []
        valuesUpdate.map((value: EntriesValuesData, index: number)=>{
            let monthly 
            let frequency = Functions.toFrequency(value.dtEnd, value.dtStart) + 1
            value.dtEnd == 209912 ? monthly = true : monthly = false
            let valueObj = {
                id: value.id,
                description: value.description,
                amount: value.amount,
                monthly: monthly,
                frequency: frequency,
                entries_id: value.entries_id,
            }
            valuesBeforeUpdate.push(valueObj)
        })
        setEntriesValuesBeforeCreate(valuesBeforeUpdate)
    }

    function updateEntrieIdUpdate(idUpdate:number){
        setEntrieIdUpdate(idUpdate)
    }

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

    //TODO a data no cadastro tem que ser igual a data selecionada

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
        id:0,
        description: '',
        amount: 0,
        monthly: false,
        frequency: 1,
        entries_id: 0,
    }]

    const [entrieValuesBeforeCreate, setEntriesValuesBeforeCreate] = useState<ValuesData[]>(initialValue)

    function addNewValueBeforeCreate(newValue : ValuesData){
        setEntriesValuesBeforeCreate([...entrieValuesBeforeCreate, newValue])
    }

    //----------------------------------------------//

    function resetValues(){
        setEntriesValuesBeforeCreate(initialValue)
        setEntrieFrequency(1)
        setTitleInputEntrie('')
        setIsEnabledMonthly(false)
        setIsEnabledReceived(false)
        setCalendarDate(new Date())
    }
    
    function updateEntrieValuesBeforeCreate(subitem: string, index: number, e: any){
            let arrOfEntriesValues = entrieValuesBeforeCreate.map((entrieValue:ValuesData, i:number)=>{
                if (index === i){    
                    if (subitem == 'monthly') {
                        setValuesIsChanged(true)
                        return { ...entrieValue, ['monthly']: !entrieValue.monthly }
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
                    else if (subitem == "frequency"){
                        setValuesIsChanged(true)
                        return { ...entrieValue, ['frequency']:  e.nativeEvent.text}
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
                let newDtEnd
                if (valuesIsChanged){
                    if (value.monthly){
                        newDtEnd = 209912
                    }else{
                        newDtEnd = Functions.setDtEnd(false, value.frequency, calendarDate)
                    }
                }else{
                    newDtEnd = dtEnd 
                }
                
                const ValueObj:any = {
                    description: value.description,
                    amount: Number(amount),
                    dtStart: dtStart,
                    dtEnd: newDtEnd, 
                    entries_id: EntrieId
                }
                valuesDB.create(ValueObj).then(()=>{
                    console.log("Create!")
                    //alert('valor cadastrado com sucesso!')
                    updateLoadAction()
                    resetValues()
                }).catch(err => {
                    console.log(err)
                })
            })
            updateLoadAction()
        }).catch(err => {
            console.log(err)
        })
    }

    function handleUpdate(){
        let dtStart = Functions.setDtStart(calendarDate)
        let dtEnd = Functions.setDtEnd(isEnabledMonthly, entrieFrequency, calendarDate)
        const EntrieObj : EntriesData = {
            title: titleInputEntrie,
            day: calendarDate.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: isEnabledMonthly,
            received: isEnabledReceived,
            type: typeOfEntrie,
        }
        entriesDB.update(entrieIdUpdate, EntrieObj).then(()=>{
            alert("atualizado!")
            updateLoadAction()
        })

        entrieValuesBeforeCreate.map((value: ValuesData) =>{
            let amount = String(value.amount)
                amount = amount.replace(/[.]/g, '')
                amount = amount.replace(/[,]/g, '')
            let newDtEnd
                    if (value.monthly){
                        newDtEnd = 209912
                    }else{
                        newDtEnd = Functions.setDtEnd(false, value.frequency, calendarDate)
                    }
            const ValueObj:any = {
                description: value.description,
                amount: Number(amount),
                dtStart: dtStart,
                dtEnd: newDtEnd, 
                entries_id: entrieIdUpdate
            }
            if (value.id !=0){
                valuesDB.update(value.id, ValueObj).then(()=>{
                })
            }else{
                valuesDB.create(ValueObj)
            }
        })
    }

    function handleDeleteEntrie(entrieId:number){
        entriesByDate.map((entrie:EntriesByDateData)=>{
            if (entrie.id == entrieId){
                const newDate = new Date()
                newDate.setMonth(parseInt(Functions.toMonthAndYear(entrie.dtStart).month) - 1)
                newDate.setFullYear(parseInt(Functions.toMonthAndYear(entrie.dtStart).year))
                let newDtEnd
                if ((selectedMonth) < 10) {
                    newDtEnd = selectedYear.toString() + '0' + selectedMonth.toString()
                } else {
                    newDtEnd = selectedYear.toString() + selectedMonth.toString()
                }
                let contRep = Functions.toFrequency(parseInt(newDtEnd), entrie.dtStart)
                if (contRep > 0) {
                    const entrieObj = {
                        title: entrie.title,
                        day: entrie.day,
                        dtStart: entrie.dtStart,
                        dtEnd: Functions.setDtEnd(false, contRep, newDate),
                        monthly: false,
                        received: entrie.received,
                        type: entrie.type
                    }
                    
                    entriesDB.update(entrieId, entrieObj)
                    updateLoadAction()
                } else {
                    entriesDB.remove2(entrieId).then(()=>{
                        updateLoadAction()
                    }).catch(err =>{
                        console.log(err)
                    })
                }
                
                updateLoadAction()
                handleDeleteEntrieValues(entrieId, -1)
            }
        })
    }

    function handleDeleteEntrieValues(entrieId:number, valueId:number){
        entriesValuesByDate.map((value: EntriesValuesData)=>{
            if(value.entries_id == entrieId || value.id == valueId){
                const newDate = new Date()
                newDate.setMonth(parseInt(Functions.toMonthAndYear(value.dtStart).month) - 1)
                newDate.setFullYear(parseInt(Functions.toMonthAndYear(value.dtStart).year))
                let newDtEnd
                if ((selectedMonth) < 10) {
                    newDtEnd = selectedYear.toString() + '0' + selectedMonth.toString()
                } else {
                    newDtEnd = selectedYear.toString() + selectedMonth.toString()
                }
                let contRep = Functions.toFrequency(parseInt(newDtEnd), value.dtStart)

                if (contRep > 0) {
                    const vlObj = {
                        description: value.description,
                        amount: value.amount,
                        dtStart: value.dtStart,
                        dtEnd: Functions.setDtEnd(false, contRep, newDate),
                        entries_id: value.entries_id
                    }
                    valuesDB.update(value.id, vlObj)
                    updateLoadAction()
                } else {
                    valuesDB.remove(value.id)
                    updateLoadAction()
                }
                updateLoadAction()
            }
        })
    }

    function updateEntrieReceived(selectedId: number) {
        entriesDB.findById(selectedId).then((res: any) => {
            let obj = {
                title: res._array[0].title,
                day: res._array[0].day,
                dtStart: res._array[0].dtStart,
                dtEnd: res._array[0].dtEnd,
                monthly: res._array[0].monthly,
                received: true,
                type: res._array[0].type,
            }
            entriesDB.update(selectedId, obj).then(res => {
                alert("Pago!")
                updateLoadAction()
            }).catch(err => {
                console.log(err)
            })
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
            entrieIdUpdate,
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
            handleDeleteEntrie,
            handleDeleteEntrieValues,
            updateEntrieReceived,
            addNewValueBeforeCreate,
            updateEntrieIdUpdate,
            setEntrieValuesUpdate,
            resetValues,
            setValuesUpdate,
            handleUpdate,
        }}>
            {children}
        </NewEntriesContext.Provider>
    )
}