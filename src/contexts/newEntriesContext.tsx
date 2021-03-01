import React, {createContext, useState, ReactNode, useEffect} from 'react';
import { Platform } from 'react-native';

interface EntriesValuesData{
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
    onChangeDate: (event: any, selectedDate: any) => void;
    showDatepicker: () => void;
    setTitleInputEntrie: (titleInputEntrie:string) => void;
    toggleSwitchReceived: () => void;
    toggleSwitchMonthly: () => void;
    decreaseEntrieFrequency: () => void;
    increaseEntrieFrequency: () => void;
}

interface NewEntriesProviderProps{
    children: ReactNode;
}


export const NewEntriesContext = createContext({} as NewEntriesContextData)

export function NewEntriesProvider({children}: NewEntriesProviderProps){

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
        //seta o switch mensal como true ou false
        setIsEnabledMonthly(previousState => !previousState)
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

    const [entrieValuesBeforeCreate, setEntriesValuesBeforeCreate] = useState<EntriesValuesData[]>([])
    //parei aqui
    function updateEntrieValuesBeforeCreate(subitem: string, index: number, value: any){
        (e: any)=>{
            let arrOfEntriesValues = entrieValuesBeforeCreate.map((entrieValue:EntriesValuesData, i:number)=>{
                if (index === i){
                    if (subitem == 'monthly') {
                        return { ...entrieValue, [subitem]: value = !value }
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
                    else {
                        return { ...entrieValue, [subitem]: e.nativeEvent.text }
                    }
                } else {
                    return entrieValue
                }
            })
            setEntriesValuesBeforeCreate(arrOfEntriesValues)
        }
    }

    return(
        <NewEntriesContext.Provider value={{
            calendarDate,
            showCalendar,
            titleInputEntrie,
            isEnabledReceived,
            isEnabledMonthly,
            entrieFrequency,
            onChangeDate,
            showDatepicker,
            setTitleInputEntrie,
            toggleSwitchReceived,
            toggleSwitchMonthly,
            decreaseEntrieFrequency,
            increaseEntrieFrequency,

        }}>
            {children}
        </NewEntriesContext.Provider>
    )
}