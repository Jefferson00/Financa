
import React, {createContext, useState, ReactNode, useContext} from 'react';
import { Platform } from 'react-native';
import entriesDB from '../services/entriesDB';
import latestDB from '../services/latestDB';
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
    category:string,
}

interface EntriesData{
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
    category:string,
}

interface ValuesData{
    id:number,
    description: string,
    amount: number,
    monthly: boolean,
    frequency: number,
    entries_id: number,
    dtStart: number,
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
    typeOfEntrie:string;
    entrieCategory:string;
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
    updateEntrieCategory: (category:string)=> void;
    removeValueBeforeCreate: (index:number)=> void;
}

interface NewEntriesProviderProps{
    children: ReactNode;
}


export const NewEntriesContext = createContext({} as NewEntriesContextData)

export function NewEntriesProvider({children}: NewEntriesProviderProps){

    const {entriesByDate, entriesValuesByDate , allEntriesValues, updateLoadAction, loadNotifications} = useContext(DataBDContext)
    const {selectedYear, selectedMonth} = useContext(MainContext)

    const [typeOfEntrie, setTypeOfEntrie] = useState('');
    const [entrieIdUpdate, setEntrieIdUpdate] = useState(0);

    const [valuesIsChanged, setValuesIsChanged] = useState(false);

    function setEntrieValuesUpdate(entrie:any){
        setTitleInputEntrie(entrie.title)
        if(entrie.category !== undefined){
            setEntrieCategory(entrie.category)
        }else{
            setEntrieCategory('others')
        }

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
                dtStart: value.dtStart
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
    }

    //-------------------------------//
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || calendarDate;
        setShowCalendar(Platform.OS === 'ios');
        setCalendarDate(currentDate);
    };

    const showDatepicker = () => {
        setShowCalendar(true);
    };

    //----------------------//

    const [isEnabledReceived, setIsEnabledReceived] = useState(false);
    const [isEnabledMonthly, setIsEnabledMonthly] = useState(false);

    const toggleSwitchReceived = () => setIsEnabledReceived(previousState => !previousState);

    const toggleSwitchMonthly = () => {
        setIsEnabledMonthly(previousState => !previousState)
    };

    //-------------------------------------//

    const [titleInputEntrie, setTitleInputEntrie] = useState('');
    const [entrieCategory, setEntrieCategory] = useState("others");

    function updateEntrieCategory (category:string){
        setEntrieCategory(category)
    }

    const [entrieFrequency, setEntrieFrequency] = useState(1);

    function decreaseEntrieFrequency(){
        if(entrieFrequency > 1) setEntrieFrequency(entrieFrequency - 1)
    }

    function increaseEntrieFrequency(){
        setEntrieFrequency(entrieFrequency + 1)
    }

    //----------------------------------------------//
    //define dtStart of initalValue
    const dtStart = Functions.setDtStart(new Date())
    const initialValue: ValuesData[] = [{
        id:0,
        description: '',
        amount: 0,
        monthly: false,
        frequency: 1,
        entries_id: 0,
        dtStart:dtStart,
    }]

    const [entrieValuesBeforeCreate, setEntriesValuesBeforeCreate] = useState<ValuesData[]>(initialValue)

    function addNewValueBeforeCreate(newValue : ValuesData){
        setEntriesValuesBeforeCreate([...entrieValuesBeforeCreate, newValue])
    }

    function removeValueBeforeCreate(index:number){
        let arr = entrieValuesBeforeCreate.slice()
        arr.splice(index,1)
        setEntriesValuesBeforeCreate(arr)
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

        const EntrieObj : EntriesData = {
            title: titleInputEntrie,
            day: calendarDate.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: isEnabledMonthly,
            received: isEnabledReceived,
            type: typeOfEntrie,
            category: entrieCategory,
        }

        entriesDB.create(EntrieObj).then(()=>{
            alert('cadastrado com sucesso!')
            updateLoadAction()
        }).catch(err=>{
            console.log(err)
            alert('erro: '+err)
        })
        entriesDB.all().then((res:any)=>{
            let totalValues = 0
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
                totalValues = totalValues + Number(amount)
                const ValueObj:any = {
                    description: value.description,
                    amount: Number(amount),
                    dtStart: dtStart,
                    dtEnd: newDtEnd, 
                    entries_id: EntrieId
                }
                console.log("New dt End "+newDtEnd)
                valuesDB.create(ValueObj).then(()=>{
                    updateLoadAction()
                    resetValues()
                }).catch(err => {
                    console.log(err)
                })
            })
            if(isEnabledReceived){
                let ltsObj = {
                    title: titleInputEntrie,
                    day: new Date().getDate(),
                    month: new Date().getMonth() +1,
                    type: typeOfEntrie,
                    category: entrieCategory,
                    amount: totalValues,
                    entrie_id: res._array.slice(-1)[0].id,
                }
                console.log('lts: '+ltsObj.amount)
                latestDB.create(ltsObj)
            }
            updateLoadAction()
            loadNotifications()
        }).catch(err => {
            console.log(err)
        })
    }

    function updateLatestReceived(){
        latestDB.all().then((res:any)=>{
            res._array.map((ltsEntrie:any) =>{
                if(ltsEntrie.entrie_id == entrieIdUpdate){
                    console.log('ok')
                    console.log('ltsEntrie.entrie_id: '+ltsEntrie.entrie_id + " entrieIdUpdate "+entrieIdUpdate)
                    let totalValues = 0
                    entrieValuesBeforeCreate.map((value: ValuesData) =>{
                        let amount = String(value.amount)
                        amount = amount.replace(/[.]/g, '')
                        amount = amount.replace(/[,]/g, '')
                        totalValues = totalValues + Number(amount)
                    })
                    let ltsObj = {
                        title: titleInputEntrie,
                        day: ltsEntrie.day,
                        month: ltsEntrie.month,
                        type: ltsEntrie.type,
                        category: entrieCategory,
                        amount: totalValues,
                        entrie_id: entrieIdUpdate,
                    }
                    console.log('           '+ltsObj.category)
                    latestDB.update(ltsEntrie.id,ltsObj)
                }
            })
        })
    }

    function createLatestReceivedOnUpdate(){
        entriesDB.findById(entrieIdUpdate).then((res:any)=>{
            if (!res._array[0].received && isEnabledReceived){
                let totalValues = 0
                entrieValuesBeforeCreate.map((value: ValuesData) =>{
                    let amount = String(value.amount)
                    amount = amount.replace(/[.]/g, '')
                    amount = amount.replace(/[,]/g, '')
                    totalValues = totalValues + Number(amount)
                })
                let ltsObj = {
                    title: titleInputEntrie,
                    day: new Date().getDate(),
                    month: new Date().getMonth() +1,
                    type: typeOfEntrie,
                    category: entrieCategory,
                    amount: totalValues,
                    entrie_id: res._array.slice(-1)[0].id,
                }
                latestDB.create(ltsObj)
            }
            if (res._array[0].received && !isEnabledReceived){
                latestDB.remove(entrieIdUpdate)
            }
        })
    }

    function handleUpdate(){
        
        entriesDB.findById(entrieIdUpdate).then((res:any)=>{
            let dtStartBeforeUpdate:number
            dtStartBeforeUpdate = res._array[0].dtStart
            let dtStart = Functions.setDtStart(calendarDate)
            let dtEnd = Functions.setDtEnd(isEnabledMonthly, entrieFrequency, calendarDate)
            console.log("dtstart: "+dtStart)
            console.log("dtend: "+dtEnd)
            const EntrieObj : EntriesData = {
                title: titleInputEntrie,
                day: calendarDate.getDate(),
                dtStart: dtStart,
                dtEnd: dtEnd,
                monthly: isEnabledMonthly,
                received: isEnabledReceived,
                type: typeOfEntrie,
                category:entrieCategory
            }
    
            createLatestReceivedOnUpdate()
            isEnabledReceived && updateLatestReceived()
    
            entriesDB.update(entrieIdUpdate, EntrieObj).then(()=>{
                alert("atualizado!")
                updateLoadAction()
            })
    
            entrieValuesBeforeCreate.map((value: ValuesData) =>{
                let amount = String(value.amount)
                    amount = amount.replace(/[.]/g, '')
                    amount = amount.replace(/[,]/g, '')
                let newDtEnd
               
                if (value.id !=0){
                    let valueBeforeUpdate = entriesValuesByDate.filter(vlu => vlu.id == value.id)
                    let valueDate = new Date()
                    let newDtStart
                    
                    if(dtStartBeforeUpdate == value.dtStart){
                        newDtStart = dtStart
                    }else{
                        newDtStart = value.dtStart
                    }
                    console.log("valueBeforeUpdate[0].amount "+valueBeforeUpdate[0].amount)
                    console.log("value.amount "+value.amount)
                    valueDate.setMonth(Number(Functions.toMonthAndYear(newDtStart).month)-1)
                    valueDate.setFullYear(Number(Functions.toMonthAndYear(newDtStart).year))
                    let DtEnd
                    if ((calendarDate.getMonth() + 1) < 10) {
                        DtEnd = calendarDate.getFullYear().toString() + '0' + (calendarDate.getMonth() + 1).toString()
                    } else {
                        DtEnd = calendarDate.getFullYear().toString() + (calendarDate.getMonth() + 1).toString()
                    }
                    let contFreq = Functions.toFrequency(parseInt(DtEnd),newDtStart)
                    if (valueBeforeUpdate[0].amount != Number(amount)){
                        const ValueObjUpdate:any = {
                            description: value.description,
                            amount: valueBeforeUpdate[0].amount,
                            dtStart: newDtStart,
                            dtEnd: Functions.setDtEnd(false, contFreq, valueDate ), 
                            entries_id: entrieIdUpdate
                        }
                        valuesDB.update(value.id, ValueObjUpdate)
                        const NewValueObjUpdate:any = {
                            description: value.description,
                            amount:  Number(amount),
                            dtStart: Functions.setDtStart(calendarDate),
                            dtEnd: Functions.setDtEnd(true, 0, valueDate ), 
                            entries_id: entrieIdUpdate
                        }
                        valuesDB.create(NewValueObjUpdate)
                    }else{
                        if (value.monthly){
                            newDtEnd = 209912
                        }else{
                            newDtEnd = Functions.setDtEnd(false, value.frequency, valueDate)
                        }
                        const ValueObjUpdate:any = {
                            description: value.description,
                            amount: Number(amount),
                            dtStart: newDtStart,
                            dtEnd: newDtEnd, 
                            entries_id: entrieIdUpdate
                        }
                        valuesDB.update(value.id, ValueObjUpdate).then(()=>{
                        })

                    }
                }else{
                    let newDate = new Date()
                    newDate.setMonth(selectedMonth-1)
                    newDate.setFullYear(selectedYear)
                    let newDtStart = Functions.setDtStart(newDate)
                    
                    if (value.monthly){
                        newDtEnd = 209912
                    }else{
                        newDtEnd = Functions.setDtEnd(false, value.frequency, newDate)
                    }
                    const ValueObjCreate:any = {
                        description: value.description,
                        amount: Number(amount),
                        dtStart: newDtStart,
                        dtEnd: newDtEnd, 
                        entries_id: entrieIdUpdate
                    }
                    valuesDB.create(ValueObjCreate)
                }
            })
        })
        loadNotifications()
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
                        type: entrie.type,
                        category:entrie.category
                    }
                    
                    entriesDB.update(entrieId, entrieObj)
                    updateLoadAction()
                } else {
                    entriesDB.remove2(entrieId).then(()=>{
                        updateLoadAction()
                    }).catch(err =>{
                        console.log(err)
                    })
                    latestDB.remove(entrieId).then(()=>{
                        updateLoadAction()
                    }).catch(err =>{
                        console.log(err)
                    })
                }
                
                updateLoadAction()
                handleDeleteEntrieValues(entrieId, -1)
            }
        })
        loadNotifications()
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
                    valuesDB.update(value.id, vlObj).then(()=>{
                        updateLoadAction()
                    })
                } else {
                    valuesDB.remove(value.id).then(()=>{
                        updateLoadAction()
                    })
                }
                updateLoadAction()
            }
        })
    }

    function updateEntrieReceived(selectedId: number) {
        //console.log('selected ID: '+selectedId)
        entriesDB.findById(selectedId).then((res: any) => {
            let obj = {
                title: res._array[0].title,
                day: res._array[0].day,
                dtStart: res._array[0].dtStart,
                dtEnd: res._array[0].dtEnd,
                monthly: res._array[0].monthly,
                received: true,
                type: res._array[0].type,
                category:res._array[0].category,
            }
            let totalValues = 0
            allEntriesValues.map((value:EntriesValuesData) => {
                if (selectedId === value.entries_id){
                    totalValues = totalValues + value.amount
                }
            })
            let ltsObj = {
                title: res._array[0].title,
                day: new Date().getDate(),
                month: new Date().getMonth() +1,
                type: res._array[0].type,
                category: res._array[0].category,
                amount: totalValues,
                entrie_id: selectedId,
            }
            latestDB.create(ltsObj)
            entriesDB.update(selectedId, obj).then(res => {
                alert("Pago!")
                loadNotifications()
                updateLoadAction()
            }).catch(err => {
                console.log(err)
            })
        }).catch(err=>{
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
            entrieIdUpdate,
            entrieCategory,
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
            updateEntrieCategory,
            removeValueBeforeCreate,
        }}>
            {children}
        </NewEntriesContext.Provider>
    )
}