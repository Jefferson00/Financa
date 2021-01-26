import React, { createContext, useState, useContext } from 'react'

const StylesStatesContext = createContext({});

export default function StylesStatesProvider({children}:any){
    const [textModal, setTextModal] = useState('')
    const [primaryColor, setPrimaryColor] = useState('#F9CF3C')
    const [secondColor, setSecondColor] = useState('#B26A15')
    const [monthColor, setMonthColor] = useState('#1A8289')
    const [modalBalance, setModalBalance] = useState(false)

    return(
        <StylesStatesContext.Provider 
            value={{
                textModal, setTextModal,
                primaryColor, setPrimaryColor,
                secondColor, setSecondColor,
                monthColor, setMonthColor,
                modalBalance, setModalBalance
            }}
        >
            {children}
        </StylesStatesContext.Provider>
    )
}

export function useStylesStates(){
    const context = useContext(StylesStatesContext);
    const {textModal, setTextModal,primaryColor, setPrimaryColor,secondColor, setSecondColor,monthColor, setMonthColor, modalBalance, setModalBalance}: any = context
    return {textModal, setTextModal,primaryColor, setPrimaryColor,secondColor, setSecondColor,monthColor, setMonthColor, modalBalance, setModalBalance};
}