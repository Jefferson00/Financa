import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import { NewEntriesContext } from './newEntriesContext';

interface StylesContextData{
    secondGradientColor:string;
    firstGradientColor:string;
    monthColor:string;
    entrieButtonBackground:string;
    entrieButtonBorder:string;
    entriePrimaryColor:string;
    entrieSecondaryColor:string;
    isEntriesModalVisible:boolean;
    selectedEntrieId:number;
    selectedEntrieTotalValues:number;
    isValuesFormVisible:boolean;
    textModal:string;
    textAlertModal:string;
    hasNotifications:boolean;
    updateMonthColorMainScreen: ()=> void;
    updateEntriesModalVisible: ()=> void;
    showEntrieModal: (entrieId: number, totalValues:number)=> void;
    resetSelectedEntrieId: ()=> void;
    showValuesForm: ()=> void;
    resetValuesForm: ()=> void;
    updateHasNotification: (value:boolean)=> void;
}

interface StylesProviderProps{
    children: ReactNode;
}

export const StylesContext = createContext({} as StylesContextData)

export function StylesProvider({children}: StylesProviderProps){

    const {typeOfEntrie, updateTypeOfEntrie} = useContext(NewEntriesContext)

    const [firstGradientColor, setFirstGradientColor] = useState('#ffffff')
    const [secondGradientColor, setSecondGradientColor] = useState('#ffffff')
    const [entrieButtonBackground, setEntrieButtonBackground] = useState('#ffffff')
    const [entrieButtonBorder, setEntrieButtonBorder] = useState('#ffffff')
    const [entriePrimaryColor, setEntriePrimaryColor] = useState('#ffffff')
    const [entrieSecondaryColor, setEntrieSecondaryColor] = useState('#ffffff')
    const [monthColor, setMonthColor] = useState('#3C93F9')

    const [isEntriesModalVisible, setIsEntriesModalVisible] = useState(false)
    const [selectedEntrieId, setSelectedEntrieId] = useState(0)
    const [selectedEntrieTotalValues, setSelectedEntrieTotalValues] = useState(0)
    
    const [isValuesFormVisible, setIsValuesFormVisible] = useState(false)

    const [textAlertModal, setTextAlertModal] = useState('')
    const [textModal, setTextModal] = useState('')
    const [hasNotifications, setHasNotifications] = useState(false)


    function updateEntriesModalVisible(){
        setIsEntriesModalVisible(!isEntriesModalVisible)
    }

    function showValuesForm(){
        setIsValuesFormVisible(true)
    }

    function resetValuesForm(){
        setIsValuesFormVisible(false)
    }

    function updateHasNotification(value:boolean){
        setHasNotifications(value)
    }

    function showEntrieModal(entrieId: number, totalValues:number){
        setIsEntriesModalVisible(true)
        setSelectedEntrieId(entrieId)
        setSelectedEntrieTotalValues(totalValues)
    }

    function resetSelectedEntrieId(){
        setSelectedEntrieId(0)
    }


    function updateMonthColorMainScreen(){
        setMonthColor('#3C93F9')
        updateTypeOfEntrie('')
        console.log('updated!')
    }

    useEffect(()=>{
        //console.log(" Tipo: "+typeOfEntrie)
        if(typeOfEntrie == "Ganhos"){
            setFirstGradientColor("#155F69")
            setSecondGradientColor("#F9CF3C")
            setMonthColor("#F9CF3C")
            setEntrieButtonBackground("rgba(26, 130, 137, 0.8)")
            setEntrieButtonBorder("#24DBBA")
            setEntriePrimaryColor("#1A8289")
            setEntrieSecondaryColor("#1B9F88")
            setTextAlertModal('Não recebido!')
            setTextModal('Esse ganho foi recebido?')
        }
        else if(typeOfEntrie == "Despesas"){
            setFirstGradientColor("#CC3728")
            setSecondGradientColor("#F9CF3C")
            setMonthColor("#FFFFFF")
            setEntrieButtonBackground("rgba(255, 72, 53, 0.8)")
            setEntrieButtonBorder("#CC3728")
            setEntriePrimaryColor("#CC3728")
            setEntrieSecondaryColor("#FF4835")
            setTextAlertModal('Despesa não paga!')
            setTextModal('Essa despesa foi paga?')
        }
        else{
            setMonthColor("#3C93F9")
        }
    },[typeOfEntrie])

    return(
        <StylesContext.Provider value={{
            firstGradientColor,
            secondGradientColor,
            monthColor,
            entrieButtonBackground,
            entrieButtonBorder,
            entriePrimaryColor,
            entrieSecondaryColor,
            isEntriesModalVisible,
            selectedEntrieId,
            selectedEntrieTotalValues,
            isValuesFormVisible,
            textModal,
            textAlertModal,
            hasNotifications,
            updateMonthColorMainScreen,
            updateEntriesModalVisible,
            showEntrieModal,
            resetSelectedEntrieId,
            showValuesForm,
            resetValuesForm,
            updateHasNotification,
        }}>
            {children}
        </StylesContext.Provider>
    )
}
