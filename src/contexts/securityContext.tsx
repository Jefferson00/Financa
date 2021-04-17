import React, {createContext, useState, ReactNode, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

interface SecurityContextData{
    isSecurityEnable:boolean;
    isScanned:boolean;
    hasPin:boolean;
    toggleSwitchSecurity: () => void;
    getSecurityActive: () => Promise<string | undefined>;
    getPin: () => Promise<void>;
    handleAuthentication: () => void;
    updateAccess: () => void;
    savePin: (value:string) => void;
}

interface SecurityProviderProps{
    children: ReactNode;
}

export const SecurityContext = createContext({} as SecurityContextData)

export function SecurityProvider({children}: SecurityProviderProps){
    const [isSecurityEnable, setIsSecurityEnable] = useState(false)
    const [isScanned, setIsScanned] = useState(false)
    const [hasPin, setHasPin] = useState(false)
    const [securePin, setSecurePin] = useState('')
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

    async function savePin(value:string) {
        await SecureStore.setItemAsync('SecurePin', value);
    }

    async function getPin() {
        let result = await SecureStore.getItemAsync('SecurePin');
        console.log(result)
        if (result) {
          setHasPin(true)
        } else {
          setHasPin(false)
        }
    }


    async function storeSecurityActive (value:string) {
        try {
            await AsyncStorage.setItem('IsSecurityActive', value)
        } catch (error) {
            
        }
    }

    function updateAccess(){
        setIsScanned(true)
    }

    useEffect(()=>{
        let item = getSecurityActive()
        item.then((stringIsSecurityActive)=>{
            if(stringIsSecurityActive == "true"){
                if(!isScanned) handleAuthentication()
            }else{
                setIsScanned(true)
            }
        })
        getPin()
    },[isScanned])

    async function handleAuthentication(){
        let result = await LocalAuthentication.authenticateAsync()
        console.log('result: '+result.success)
        if(result.success){
            setIsScanned(true)
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
            isScanned,
            hasPin,
            toggleSwitchSecurity,
            getSecurityActive,
            handleAuthentication,
            updateAccess,
            savePin,
            getPin
        }}>
            {children}
        </SecurityContext.Provider>
    )
}