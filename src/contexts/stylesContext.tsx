import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import { useColorScheme } from 'react-native';
import { NewEntriesContext } from './newEntriesContext';

type ColorSchemeName = 'light' | 'dark' | null | undefined;

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
    isRendered:boolean;
    colorScheme:ColorSchemeName;
    isDarkTheme:boolean;
    updateMonthColorMainScreen: ()=> void;
    updateEntriesModalVisible: ()=> void;
    showEntrieModal: (entrieId: number, totalValues:number)=> void;
    resetSelectedEntrieId: ()=> void;
    showValuesForm: ()=> void;
    resetValuesForm: ()=> void;
    onMonted: ()=> void;
    onUnmonted: ()=> void;
    updateHasNotification: (value:boolean)=> void;
    setDarkTheme: ()=> void;
    changeTheme: ()=> void;
}

interface StylesProviderProps{
    children: ReactNode;
}

export const StylesContext = createContext({} as StylesContextData)

export function StylesProvider({children}: StylesProviderProps){
    const colorScheme = useColorScheme()
    const {typeOfEntrie, updateTypeOfEntrie} = useContext(NewEntriesContext)

    const [firstGradientColor, setFirstGradientColor] = useState('#ffffff')
    const [secondGradientColor, setSecondGradientColor] = useState('#ffffff')
    const [entrieButtonBackground, setEntrieButtonBackground] = useState('#ffffff')
    const [entrieButtonBorder, setEntrieButtonBorder] = useState('#ffffff')
    const [entriePrimaryColor, setEntriePrimaryColor] = useState('#ffffff')
    const [entrieSecondaryColor, setEntrieSecondaryColor] = useState('#ffffff')
    const [monthColor, setMonthColor] = useState('#3C93F9')
    const [theme, setTheme] = useState('automatic')
    const [isDarkTheme, setIsDarkTheme] = useState(false)

    const [isEntriesModalVisible, setIsEntriesModalVisible] = useState(false)
    const [selectedEntrieId, setSelectedEntrieId] = useState(0)
    const [selectedEntrieTotalValues, setSelectedEntrieTotalValues] = useState(0)
    
    const [isValuesFormVisible, setIsValuesFormVisible] = useState(false)

    const [textAlertModal, setTextAlertModal] = useState('')
    const [textModal, setTextModal] = useState('')
    const [hasNotifications, setHasNotifications] = useState(false)
    const [isRendered, setIsRendered] = useState(false)

    function onMonted(){
        setIsRendered(true)
    }

    function onUnmonted(){
        setIsRendered(false)
    }

    function setDarkTheme(){
        setTheme('dark')
    }

    function setLightTheme(){
        setTheme('light')
    }

    function setAutomaticTheme(){
        setTheme('automatic')
    }

    function changeTheme(){
        setIsDarkTheme(previousState => !previousState)
    }


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
        console.log(entrieId)
        setIsEntriesModalVisible(true)
        setSelectedEntrieId(entrieId)
        setSelectedEntrieTotalValues(totalValues)
    }

    function resetSelectedEntrieId(){
        setSelectedEntrieId(0)
    }


    function updateMonthColorMainScreen(){
        if (colorScheme == 'dark' || theme == 'dark'){
            setMonthColor('#ffffff')
        }else{
            setMonthColor('#3C93F9')
        }
        updateTypeOfEntrie('')
        //console.log('updated!')
    }

    useEffect(()=>{
        console.log(" Tipo: "+typeOfEntrie)
    
        if(typeOfEntrie == "Ganhos"){
            if (colorScheme == 'dark' || isDarkTheme){
                setMonthColor('#ffffff')
                setEntriePrimaryColor("#24DBBA")
                setEntrieButtonBackground("rgba(26, 130, 137, 0.5)")
                setFirstGradientColor("#136065")
                setSecondGradientColor("#000000")
            }else{
                setMonthColor('#F9CF3C')
                setEntriePrimaryColor("#1A8289")
                setEntrieButtonBackground("rgba(26, 130, 137, 0.8)")
                setFirstGradientColor("#155F69")
                setSecondGradientColor("#F9CF3C")
            }
            setEntrieButtonBorder("#24DBBA")
            setEntrieSecondaryColor("#1B9F88")
            setTextAlertModal('Não recebido!')
            setTextModal('Esse ganho foi recebido?')
        }
        else if(typeOfEntrie == "Despesas"){
            if (colorScheme == 'dark' || isDarkTheme){
                setEntriePrimaryColor("#FF4835")
                setEntrieButtonBackground("rgba(255, 72, 53, 0.5)")
                setFirstGradientColor("#A5291D")
                setSecondGradientColor("#000000")
            }else{
                setEntriePrimaryColor("#CC3728")
                setEntrieButtonBackground("rgba(255, 72, 53, 0.8)")
                setFirstGradientColor("#CC3728")
                setSecondGradientColor("#F9CF3C")
            }
            setMonthColor("#FFFFFF")
            setEntrieButtonBorder("#CC3728")
            setEntrieSecondaryColor("#FF4835")
            setTextAlertModal('Despesa não paga!')
            setTextModal('Essa despesa foi paga?')
        }
        else{
            if (colorScheme == 'dark' || isDarkTheme){
                setMonthColor('#ffffff')
            }else{
                setMonthColor('#3C93F9')
            }
        }
 
    },[typeOfEntrie, isDarkTheme])

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
            isRendered,
            colorScheme,
            isDarkTheme,
            updateMonthColorMainScreen,
            updateEntriesModalVisible,
            showEntrieModal,
            resetSelectedEntrieId,
            showValuesForm,
            resetValuesForm,
            updateHasNotification,
            onMonted,
            onUnmonted,
            setDarkTheme,
            changeTheme,
        }}>
            {children}
        </StylesContext.Provider>
    )
}
