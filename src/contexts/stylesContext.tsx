import { useRoute } from '@react-navigation/native';
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
    updateMonthColorMainScreen: ()=> void;
    updateEntriesModalVisible: ()=> void;
    showEntrieModal: (entrieId: number, totalValues:number)=> void;
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

    const [isEntriesModalVisible, setIsEntriesModalVisible] = useState(false)
    const [selectedEntrieId, setSelectedEntrieId] = useState(0)
    const [selectedEntrieTotalValues, setSelectedEntrieTotalValues] = useState(0)

    function updateEntriesModalVisible(){
        setIsEntriesModalVisible(!isEntriesModalVisible)
    }


    function showEntrieModal(entrieId: number, totalValues:number){
        setIsEntriesModalVisible(true)
        setSelectedEntrieId(entrieId)
        setSelectedEntrieTotalValues(totalValues)
    }

    const [monthColor, setMonthColor] = useState('#3C93F9')

    //const route = useRoute()

    //&& route.name!="Main"

    function updateMonthColorMainScreen(){
        setMonthColor('#3C93F9')
        updateTypeOfEntrie('')
        console.log('updated!')
    }

    useEffect(()=>{
        console.log(" Tipo: "+typeOfEntrie)
        if(typeOfEntrie == "Ganhos"){
            setFirstGradientColor("#155F69")
            setSecondGradientColor("#F9CF3C")
            setMonthColor("#F9CF3C")
            setEntrieButtonBackground("rgba(26, 130, 137, 0.8)")
            setEntrieButtonBorder("#24DBBA")
            setEntriePrimaryColor("#1A8289")
            setEntrieSecondaryColor("#1B9F88")
        }
        else if(typeOfEntrie == "Despesas"){
            setFirstGradientColor("#CC3728")
            setSecondGradientColor("#F9CF3C")
            setMonthColor("#FFFFFF")
            setEntrieButtonBackground("rgba(255, 72, 53, 0.8)")
            setEntrieButtonBorder("#CC3728")
            setEntriePrimaryColor("#CC3728")
            setEntrieSecondaryColor("#FF4835")
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
            updateMonthColorMainScreen,
            updateEntriesModalVisible,
            showEntrieModal,
        }}>
            {children}
        </StylesContext.Provider>
    )
}
