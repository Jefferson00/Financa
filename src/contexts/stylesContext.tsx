import { useRoute } from '@react-navigation/native';
import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import { NewEntriesContext } from './newEntriesContext';

interface StylesContextData{
    secondGradientColor:string;
    firstGradientColor:string;
    monthColor:string;
    updateMonthColorMainScreen: ()=> void;
}

interface StylesProviderProps{
    children: ReactNode;
}

export const StylesContext = createContext({} as StylesContextData)

export function StylesProvider({children}: StylesProviderProps){

    const {typeOfEntrie, updateTypeOfEntrie} = useContext(NewEntriesContext)

    const [firstGradientColor, setFirstGradientColor] = useState('')
    const [secondGradientColor, setSecondGradientColor] = useState('')

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
        }
        else if(typeOfEntrie == "Despesas"){
            setFirstGradientColor("#CC3728")
            setSecondGradientColor("#F9CF3C")
            setMonthColor("#FFFFFF")
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
            updateMonthColorMainScreen,
        }}>
            {children}
        </StylesContext.Provider>
    )
}
