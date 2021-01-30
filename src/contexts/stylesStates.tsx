import React, { createContext, useState, useContext } from 'react'

const StylesStatesContext = createContext({});

export default function StylesStatesProvider({children}:any){
    const [monthColor, setMonthColor] = useState('#1A8289') //cor do mês da header
    const [primaryColor, setPrimaryColor] = useState('#F9CF3C') // primeira cor do gradiente da main
    const [secondColor, setSecondColor] = useState('#B26A15') // segunda cor do gradiente da main
    const [mainColor1, setMainColor1] = useState('') // primeira cor do gradiente das outras pages
    const [mainColor2, setMainColor2] = useState('') // segunda cor do gradiente das outras pages
    const [colorBorderAddButton, setColorBorderAddButton] = useState('#ffffff') // #24DBBA ou #FF4835
    const [colorBorderFooter, setColorBorderFooter] = useState('#ffffff') // #1A828922 ou #CC372822
    const [tittleTextColor, setTittleTextColor] = useState('#ffffff') // Cor primaria de texto e outros detalhes :#1A8289 ou #CC3728
    const [subtittleTextColor, setSubtittleTextColor] = useState('#ffffff') // Cor secundaria de texto e outros detalhes: #49B39F ou #FF4835

    const [textModal, setTextModal] = useState('')
    const [mainText1, setMainText1] = useState('')
    const [mainText2, setMainText2] = useState('')
    const [TextAddButton, setTextAddButton] = useState('')
    const [textReceived, setTextReceived] = useState('')
    const [textAlert, setTextAlert] = useState('')
    const [modalType, setModalType] = useState('none')
    const [valueTitle, onChangeTitle] = useState('')
    const [receivedTextDate, setReceivedTextDate] = useState('');
    const [receivedText, setReceivedText] = useState('');

    const [modalBalance, setModalBalance] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

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
                colorBorderAddButton, setColorBorderAddButton,
                colorBorderFooter, setColorBorderFooter,
                modalType, setModalType,
                tittleTextColor, setTittleTextColor,
                subtittleTextColor, setSubtittleTextColor,
                valueTitle, onChangeTitle,
                receivedTextDate, setReceivedTextDate,
                receivedText, setReceivedText,
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
                colorBorderAddButton, setColorBorderAddButton,
                colorBorderFooter, setColorBorderFooter,
                modalType, setModalType,
                tittleTextColor, setTittleTextColor,
                subtittleTextColor, setSubtittleTextColor,
                valueTitle, onChangeTitle,
                receivedTextDate, setReceivedTextDate,
                receivedText, setReceivedText,
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
        colorBorderAddButton, setColorBorderAddButton,
        colorBorderFooter, setColorBorderFooter,
        modalType, setModalType,
        tittleTextColor, setTittleTextColor,
        subtittleTextColor, setSubtittleTextColor,
        valueTitle, onChangeTitle,
        receivedTextDate, setReceivedTextDate,
        receivedText, setReceivedText,
    };
}