
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

interface EntrieValuesUpdateProps{
    entrieDtStartBeforeUpdate:number,
    currentEntrieDtStart:number,
    currentEntrieDtEnd:number,
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

    const {
        entriesByDate, 
        entriesValuesByDate, 
        allEntriesValues, 
        updateLoadAction, 
        loadNotifications
    } = useContext(DataBDContext)
    const {
        selectedYear,
        selectedMonth
    } = useContext(MainContext)

    /*
        Tipo da entrada
        "Ganhos" | "Despesas"
    */
    const [typeOfEntrie, setTypeOfEntrie] = useState('');

    /*
        Id da entrie que deverá ser atualizada
    */
    const [entrieIdUpdate, setEntrieIdUpdate] = useState(0);

    /*
        Determina se a frequencia dos valores foi alterado ou não
    */
    const [valuesIsChanged, setValuesIsChanged] = useState(false);

    /*
        Define a data do calendario
    */
    const [calendarDate, setCalendarDate] = useState(new Date());

    /*
        Define se o calendario é visivel ou não
    */
    const [showCalendar, setShowCalendar] = useState(false);

    /*
        Define se o switch received está ativo ou não
    */
    const [isEnabledReceived, setIsEnabledReceived] = useState(false);

    /*
        Define se o switch mensal está ativo ou não
    */
    const [isEnabledMonthly, setIsEnabledMonthly] = useState(false);

    /*
        Define o valor do input de title da entrie
    */
    const [titleInputEntrie, setTitleInputEntrie] = useState('');

    /*
        Define a categoria selecionada
    */
    const [entrieCategory, setEntrieCategory] = useState("others");

    /*
        Define o valor da frequencia da entrada
    */
    const [entrieFrequency, setEntrieFrequency] = useState(1);

    /*
        Define a dtStart do initialValue
    */
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

    /*
        Array de valores antes de criar no banco 
    */
    const [entrieValuesBeforeCreate, setEntriesValuesBeforeCreate] = useState<ValuesData[]>(initialValue)


    /*
    FUNCTIONS UPDATE VALUES ON FORM
    *
        Muda a data do calendario
    */
    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || calendarDate;
        setShowCalendar(Platform.OS === 'ios');
        setCalendarDate(currentDate);
    };
    /*
        Mostra o calendario
    */
    const showDatepicker = () => {
        setShowCalendar(true);
    };
    /*
        Muda o valor da switch received
    */
    const toggleSwitchReceived = () => setIsEnabledReceived(previousState => !previousState);
    /*
       Muda o valor da switch monthly
    */
    const toggleSwitchMonthly = () => {
        setIsEnabledMonthly(previousState => !previousState)
    };

    /*
       Muda o valor da categoria
    */
    function updateEntrieCategory (category:string){
        setEntrieCategory(category)
    }

    /*
       Muda o valor da frequencia
    */
    function decreaseEntrieFrequency(){
        if(entrieFrequency > 1) setEntrieFrequency(entrieFrequency - 1)
    }
    function increaseEntrieFrequency(){
        setEntrieFrequency(entrieFrequency + 1)
    }

    /*
       Cria um novo valor na Array
    */
    function addNewValueBeforeCreate(newValue : ValuesData){
        setEntriesValuesBeforeCreate([...entrieValuesBeforeCreate, newValue])
    }

    /*
       remover valores
    */
    function removeValueBeforeCreate(index:number){
        let arr = entrieValuesBeforeCreate.slice()
        arr.splice(index,1)
        setEntriesValuesBeforeCreate(arr)
    }

    /*
       reseta os valores do formulario para os valores padrões
    */
    function resetValues(){
        setEntriesValuesBeforeCreate(initialValue)
        setEntrieFrequency(1)
        setTitleInputEntrie('')
        setIsEnabledMonthly(false)
        setIsEnabledReceived(false)
        setCalendarDate(new Date())
        setEntrieCategory("others")
    }

    /*
        Atualiza o id da entrada que será atualizada
    */
    function updateEntrieIdUpdate(idUpdate:number){
        setEntrieIdUpdate(idUpdate)
    }

    /*
        Atualiza o tipo da entrada
    */
    function updateTypeOfEntrie(type:string){
        setTypeOfEntrie(type)
    }

    /*
    FUNCTIONS UPDATE ACTIONS
    *
        Define o formulário das ENTRADAS com os valores da entrada que deverá ser atualizada
    */
    function setEntrieValuesUpdate(entrie:any){
        //define title
        setTitleInputEntrie(entrie.title) 
        // define category
        if(entrie.category !== undefined){ 
            setEntrieCategory(entrie.category)
        }else{
            setEntrieCategory('others')
        }
        //define received switch
        entrie.received == 1 ? setIsEnabledReceived(true) : setIsEnabledReceived(false)
        //define monthly switch
        if (entrie.monthly == 1){
            setIsEnabledMonthly(true) 
            setEntrieFrequency(1)
        }else{
            setIsEnabledMonthly(false)
            let frequency = Functions.toFrequency(entrie.dtEnd, entrie.dtStart)+1
            setEntrieFrequency(frequency) 
        }
        //define calendar date
        let newDate = new Date()
        newDate.setMonth(Number(Functions.toMonthAndYear(entrie.dtStart).month)-1)
        newDate.setFullYear(Number(Functions.toMonthAndYear(entrie.dtStart).year))
        newDate.setDate(entrie.day)
        setCalendarDate(newDate)
    }

    /*
        Define o formulário dos VALORES com os valores da entrada que deverá ser atualizada
    */
    function setValuesUpdate(valuesUpdate:EntriesValuesData[]){
        //create a new values array
        let valuesBeforeUpdate: ValuesData[] = []
        //preenche a array com os valores da entrada
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
        //update values before create array
        setEntriesValuesBeforeCreate(valuesBeforeUpdate)
    }

    /*
       Atualiza os valores da array de valores
    */
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

    /*
        Atualiza os dados das últimas transações quando é atualizado a entrada correspondente
    */
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

    /*
        Cria um registro de última transação ao atualizar uma entrada com received = true
    */
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

    /*
        Atualiza uma entrada
        VERIFICAR TODOS OS CENARIOS DE ATUALIZAÇÔES E DIVIDIR A FUNÇÃO EM PARTES
    */
    function handleUpdate(){
        entriesDB.findById(entrieIdUpdate).then((res:any)=>{
            let entrieDtStartBeforeUpdate:number = res._array[0].dtStart
            //dtStart baseado no calendario atual
            let currentEntrieDtStart = Functions.setDtStart(calendarDate)
            //dtEnd baseado no calendario atual e na periodicidade atual
            let currentEntrieDtEnd = Functions.setDtEnd(isEnabledMonthly, entrieFrequency, calendarDate)
            
            let entrieValuesUpdateProps = {
                entrieDtStartBeforeUpdate,
                currentEntrieDtStart,
                currentEntrieDtEnd,
            }

            const EntrieObj : EntriesData = {
                title: titleInputEntrie,
                day: calendarDate.getDate(),
                dtStart: currentEntrieDtStart,
                dtEnd: currentEntrieDtEnd,
                monthly: isEnabledMonthly,
                received: isEnabledReceived,
                type: typeOfEntrie,
                category:entrieCategory
            }
    
            //Atualiza a entrada
            entriesDB.update(entrieIdUpdate, EntrieObj).then(()=>{
                createLatestReceivedOnUpdate()
                isEnabledReceived && updateLatestReceived()
                alert("atualizado!")
                handleUpdateEntrieValues(entrieValuesUpdateProps)
                updateLoadAction()
            })
        })
        loadNotifications()
    }

    function getSelectedDate(){
        let selectedDate
        if (selectedMonth < 10) {
            selectedDate = selectedYear.toString() + '0' + selectedMonth.toString()
        } else {
            selectedDate = selectedYear.toString() + selectedMonth.toString()
        }
        return Number(selectedDate)
    }

    async function getAmountBeforeUpdate(id:number){
        let selectedDate
        let amountBeforeUpdate = "0"
        selectedDate = getSelectedDate()
        await valuesDB.findByDate(selectedDate).then((res:any)=>{
            res._array.map((value:any)=>{
                if(value.id == id){
                    amountBeforeUpdate = String(value.amount)
                    amountBeforeUpdate = amountBeforeUpdate.replace(/[.]/g, '')
                    amountBeforeUpdate = amountBeforeUpdate.replace(/[,]/g, '')
                }
            })
        })
        return Number(amountBeforeUpdate)
    }

    function handleUpdateEntrieValues(entrieValuesUpdateProps: EntrieValuesUpdateProps){
        entrieValuesBeforeCreate.map((value: ValuesData, index:number) =>{
            let amount = String(value.amount)
                amount = amount.replace(/[.]/g, '')
                amount = amount.replace(/[,]/g, '')
            let newDtEnd : number
            let newDtStart : number
            console.log("value.id : "+value.id )
            // Se já existir no banco, ou seja, ID diferente de 0
            if (value.id !=0){
                let newDate = new Date()
                newDate.setMonth(parseInt(Functions.toMonthAndYear(value.dtStart).month)-1)
                newDate.setFullYear(parseInt(Functions.toMonthAndYear(value.dtStart).year))
                if (index == 0 && !isEnabledMonthly){
                    // se for o primeiro valor, a frequencia deverá ser a mesma da entrada
                    newDtEnd = entrieValuesUpdateProps.currentEntrieDtEnd
                    newDtStart = entrieValuesUpdateProps.currentEntrieDtStart
                   
                }else{
                    entrieValuesUpdateProps.currentEntrieDtStart > value.dtStart
                    ? 
                        newDtStart = entrieValuesUpdateProps.currentEntrieDtStart
                    :
                        newDtStart = value.dtStart
                    if (value.monthly && isEnabledMonthly){
                        newDtEnd = 209912
                    }else{
                        // a frequencia do valor não pode ser maior que da entrada
                        value.frequency <= entrieFrequency ?
                            newDtEnd = Functions.setDtEnd(false, value.frequency, newDate)
                        : 
                        !isEnabledMonthly ? newDtEnd = Functions.setDtEnd(false, entrieFrequency, newDate)
                        :  newDtEnd = Functions.setDtEnd(false, value.frequency, newDate)
                        if (newDtEnd > entrieValuesUpdateProps.currentEntrieDtEnd ){
                            newDtEnd = entrieValuesUpdateProps.currentEntrieDtEnd 
                        }
                    }
                }
                let selectedDate = getSelectedDate()
                let freqEntrieValue = Functions.toFrequency(selectedDate,newDtStart)
                getAmountBeforeUpdate(value.id).then((amountBefUpdate:number)=>{
                    console.log("amount before update: "+amountBefUpdate)
                    console.log("freqEntrieValue: "+freqEntrieValue)
                    if (freqEntrieValue > 0 && amountBefUpdate != Number(amount)){
                        console.log("YES")
                    let newDate = new Date()
                    newDate.setMonth(parseInt(Functions.toMonthAndYear(newDtStart).month)-1)
                    newDate.setFullYear(parseInt(Functions.toMonthAndYear(newDtStart).year))
                    let newUpdatedDtEnd = Functions.setDtEnd(false, freqEntrieValue, newDate)
                        updateValueWithAmountChanged(value, amountBefUpdate, newDtStart, newUpdatedDtEnd)
                        createValueWithAmountChanged(value,Number(amount),selectedDate,newDtEnd)
                    }else{
                        console.log("NO")
                        const ValueObjUpdate:any = {
                            description: value.description,
                            amount: Number(amount),
                            dtStart: newDtStart,
                            dtEnd: newDtEnd, 
                            entries_id: entrieIdUpdate
                        }
                        valuesDB.update(value.id, ValueObjUpdate)
                    }
                })

            }else{
                //cria um novo valor
                let newDate = new Date()
                newDate.setMonth(selectedMonth-1)
                newDate.setFullYear(selectedYear)
                let newDtStart = Functions.setDtStart(newDate)
                
                if (value.monthly){
                    newDtEnd = 209912
                }else{
                    newDtEnd = Functions.setDtEnd(false, value.frequency, newDate)
                }
                if (newDtEnd > entrieValuesUpdateProps.currentEntrieDtEnd ){
                    newDtEnd = entrieValuesUpdateProps.currentEntrieDtEnd 
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
        updateEntrieIdUpdate(0)
    }

    function updateValueWithAmountChanged(value: ValuesData, amount:number, newDtStart:number, newDtEnd:number){
        const ValueObjUpdate:any = {
            description: value.description,
            amount: amount,
            dtStart: newDtStart,
            dtEnd: newDtEnd, 
            entries_id: entrieIdUpdate
        }
        valuesDB.update(value.id, ValueObjUpdate)
    }

    function createValueWithAmountChanged(value: ValuesData, amount:number, newDtStart:number, newDtEnd:number){
        const ValueObjUpdate:any = {
            description: value.description,
            amount: amount,
            dtStart: newDtStart,
            dtEnd: newDtEnd, 
            entries_id: entrieIdUpdate
        }
        valuesDB.create(ValueObjUpdate)
    }

    /*
        Atualiza como recebido e cria um novo registro em ultimas transações
    */
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



    /*
    FUNCTIONS CREATE ACTIONS
    */
    /*
        Cria uma nova entrada
    */
    function handleCreateNewEntrie(){
        let entrieObj = defineEntrieCreateObject()
        entriesDB.create(entrieObj).then(()=>{
            
            //updateLoadAction() //TODO verificar se é necessário
            handleCreateNewEntrieValue() //TODO verificar se mantem criando
            alert('Cadastrado com sucesso!') //TODO criar modal especifico
        }).catch(err=>{
            console.log(err)
            alert('erro: '+err)
        }) 
    }

    /*
        Cria um novo objeto de entrada para cadastro
    */
    function defineEntrieCreateObject(){
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

        return EntrieObj
    }

    /*
        Cria novos valores para a entrada recém criada
    */
    //TODO melhorar cadastro e fazer testes
    function handleCreateNewEntrieValue(){
        let entrieObj = defineEntrieCreateObject()
        entriesDB.all().then((res:any)=>{
            let totalValues = 0
            entrieValuesBeforeCreate.map((value: ValuesData) =>{
                //define o id que faz a relação com a entrada que acabou de ser criada
                let EntrieId = res._array.slice(-1)[0].id
                let amount = String(value.amount)
                amount = amount.replace(/[.]/g, '')
                amount = amount.replace(/[,]/g, '')
                totalValues = totalValues + Number(amount)
                let newDtEnd
                /*verifica se houve mudança na periodicidade dos valores
                //se sim, cadastra de acordo com a frequencia, se não cadastra 
                //com a mesma frequencia da entrada
                */
                if (valuesIsChanged){
                    if (value.monthly){
                        newDtEnd = 209912
                    }else{
                        newDtEnd = Functions.setDtEnd(false, value.frequency, calendarDate)
                    }
                }else{
                    newDtEnd = entrieObj.dtEnd 
                }
                console.log("NEW DATEEND: "+newDtEnd)
                const ValueObj:any = {
                    description: value.description,
                    amount: Number(amount),
                    dtStart: entrieObj.dtStart,
                    dtEnd: newDtEnd, 
                    entries_id: EntrieId
                }
                console.log("ValueObj: "+ValueObj)
                valuesDB.create(ValueObj).then(()=>{
                    
                    updateLoadAction()
                    resetValues()
                }).catch(err => {
                    console.log(err)
                    alert('Erro no cadastr: '+err)
                })
            })

            /*
                Se estiver marcado como recebido, cria um registro nas ultimas transações
            */
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
                latestDB.create(ltsObj).then(()=>{
                    console.log('Cadastrado latest')
                    updateLoadAction()
                }).catch(err => {
                    console.log(err)
                })
            }
            //dispara a função de criar notificações
            loadNotifications()
        }).catch(err => {
            console.log(err)
        })
    }


    /*
    FUNCTIONS DELETE ACTIONS
    */
    /*
        Remove uma entrada
    */
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

    /*
        Remove um valor de entrada
    */
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