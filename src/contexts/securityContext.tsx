import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface SecurityContextData{
    isSecurityEnable:boolean;
    toggleSwitchSecurity: () => void;
    getSecurityActive: () => Promise<string | undefined>;
}

interface SecurityProviderProps{
    children: ReactNode;
}

export const SecurityContext = createContext({} as SecurityContextData)

export function SecurityProvider({children}: SecurityProviderProps){
    const [isSecurityEnable, setIsSecurityEnable] = useState(false)

    //const toggleSwitchSecurity = () => setIsSecurityEnable(previousState => !previousState);

    function toggleSwitchSecurity(){
        setIsSecurityEnable(previousState => !previousState)
        let stringIsSecurityActive = String(!isSecurityEnable)
        storeSecurityActive(stringIsSecurityActive)
    }

    async function getSecurityActive (){
        try {
            const value = await AsyncStorage.getItem('IsSecurityActive')
            if(value !== null){
                return value
            }else{
            }
        } catch (error) {
        }
    }

    async function storeSecurityActive (value:string) {
        try {
            await AsyncStorage.setItem('IsSecurityActive', value)
        } catch (error) {
            
        }
    }

    useEffect(() =>{
        let item = getSecurityActive()
        item.then((stringIsSecurityActive)=>{
            stringIsSecurityActive == "true" ? setIsSecurityEnable(true) : setIsSecurityEnable(false)
        })
    })

    return(
        <SecurityContext.Provider value={{
            isSecurityEnable,
            toggleSwitchSecurity,
            getSecurityActive
        }}>
            {children}
        </SecurityContext.Provider>
    )
}