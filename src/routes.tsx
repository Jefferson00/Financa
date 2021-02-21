import React, {useState,useEffect} from 'react'
import * as SecureStore from 'expo-secure-store';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const {Navigator, Screen} = createStackNavigator();

import Main from './pages/main'
import Entries from './pages/entries'
import NewEntries from './pages/newEntries'
import Login from './pages/login'
import SignUp from './pages/login/signUp'

import {useUserDB} from './contexts/auth'

export default function Routes(){

    const {isLogged, setIsLogged} = useUserDB()

    async function getValueFor(key:any) {
        let result = await SecureStore.getItemAsync(key);
        console.log('Result: '+result)
        if (result) {
          return true
        } else {
          return false
        }
      }

    useEffect(()=>{
        /*getValueFor('credentials').then(res=>{
            //console.log('get: '+res)
            if(res){
                setIsLogged(true)
                //console.log('ISLOGGED: '+isLogged)
            }
        })*/
        SecureStore.deleteItemAsync('credentials')
    },[])
    

    return(
        <NavigationContainer>
            <Navigator screenOptions={{headerShown:false}}>
                {isLogged?
                <>
                    <Screen name="Main" component={Main}/>
                    <Screen name="Entries" component={Entries}/>
                    <Screen name="NewEntries" component={NewEntries}/>
                </>
                :
                <>
                    <Screen name="Login" component={Login} />
                    <Screen name="SignUp" component={SignUp} />
                </>
                }
            </Navigator>
        </NavigationContainer>
    )
}