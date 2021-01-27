import React, { createContext, useState, useContext } from 'react'

const StylesStatesContext = createContext({});

export default function StylesStatesProvider({children}:any){
    const [textModal, setTextModal] = useState('')
    const [primaryColor, setPrimaryColor] = useState('#F9CF3C')
    const [secondColor, setSecondColor] = useState('#B26A15')
    const [monthColor, setMonthColor] = useState('#1A8289')
    const [modalBalance, setModalBalance] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [mainColor1, setMainColor1] = useState('')
    const [mainColor2, setMainColor2] = useState('')
    const [mainText1, setMainText1] = useState('')
    const [mainText2, setMainText2] = useState('')
    const [TextAddButton, setTextAddButton] = useState('')
    const [textReceived, setTextReceived] = useState('')
    const [textAlert, setTextAlert] = useState('')
    const [colorMonth, setColorMonth] = useState('#fff')
    const [colorText, setColorText] = useState('#fff')
    const [colorBorderAddButton, setColorBorderAddButton] = useState('#fff')
    const [colorBorderFooter, setColorBorderFooter] = useState('#fff')
    const [modalType, setModalType] = useState('none')
    const [tittleTextColor, setTittleTextColor] = useState('#fff')

    return(
        <StylesStatesContext.Provider 
            value={{
                textModal, setTextModal,
                primaryColor, setPrimaryColor,
                secondColor, setSecondColor,
                monthColor, setMonthColor,
                modalBalance, setModalBalance,
                modalVisible, setModalVisible,
                mainColor1, setMainColor1,
                mainColor2, setMainColor2,
                mainText1, setMainText1,
                mainText2, setMainText2,
                TextAddButton, setTextAddButton,
                textReceived, setTextReceived,
                textAlert, setTextAlert,
                colorMonth, setColorMonth,
                colorText, setColorText,
                colorBorderAddButton, setColorBorderAddButton,
                colorBorderFooter, setColorBorderFooter,
                modalType, setModalType,
                tittleTextColor, setTittleTextColor
            }}
        >
            {children}
        </StylesStatesContext.Provider>
    )
}

export function useStylesStates(){
    const context = useContext(StylesStatesContext);
    const {textModal, 
            setTextModal,
            primaryColor, 
            setPrimaryColor,
            secondColor, 
            setSecondColor,
            monthColor, 
            setMonthColor, 
            modalBalance, 
            setModalBalance,
            modalVisible, 
            setModalVisible,
            mainColor1, setMainColor1,
                mainColor2, setMainColor2,
                mainText1, setMainText1,
                mainText2, setMainText2,
                TextAddButton, setTextAddButton,
                textReceived, setTextReceived,
                textAlert, setTextAlert,
                colorMonth, setColorMonth,
                colorText, setColorText,
                colorBorderAddButton, setColorBorderAddButton,
                colorBorderFooter, setColorBorderFooter,
                modalType, setModalType,
                tittleTextColor, setTittleTextColor
        }: any = context
    return {textModal, 
        setTextModal,
        primaryColor, 
        setPrimaryColor,
        secondColor, 
        setSecondColor,
        monthColor, 
        setMonthColor, 
        modalBalance, 
        setModalBalance,
        modalVisible, 
        setModalVisible,
        mainColor1, setMainColor1,
        mainColor2, setMainColor2,
        mainText1, setMainText1,
        mainText2, setMainText2,
        TextAddButton, setTextAddButton,
        textReceived, setTextReceived,
        textAlert, setTextAlert,
        colorMonth, setColorMonth,
        colorText, setColorText,
        colorBorderAddButton, setColorBorderAddButton,
        colorBorderFooter, setColorBorderFooter,
        modalType, setModalType,
        tittleTextColor, setTittleTextColor};
}