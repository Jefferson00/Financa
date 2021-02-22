import React from 'react'

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const {Navigator, Screen} = createStackNavigator();

import Main from './pages/main'
import Entries from './pages/entries'
import NewEntries from './pages/newEntries'
import NotificationsScreen from './pages/notifications'

export default function Routes(){
    return(
        <NavigationContainer>
            <Navigator screenOptions={{headerShown:false}}>
                <Screen name="Main" component={Main}/>
                <Screen name="Entries" component={Entries}/>
                <Screen name="NewEntries" component={NewEntries}/>
                <Screen name="Notifications" component={NotificationsScreen}/>
            </Navigator>
        </NavigationContainer>
    )
}