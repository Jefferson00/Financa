import React from 'react'

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const {Navigator, Screen} = createStackNavigator();

import Main from './pages/Main'
import Ganhos from './pages/Ganhos'
import NovoGanho from './pages/NovoGanho'

export default function Routes(){
    return(
        <NavigationContainer>
            <Navigator screenOptions={{headerShown:false}}>
                <Screen name="Main" component={Main}/>
                <Screen name="Ganhos" component={Ganhos}/>
                <Screen name="NovoGanho" component={NovoGanho}/>
            </Navigator>
        </NavigationContainer>
    )
}