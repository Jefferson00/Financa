import React from 'react'

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView,
    DrawerItem,
    DrawerItemList, } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const {Navigator, Screen} = createStackNavigator();

import Main from './pages/main'
import Entries from './pages/entries'
import NewEntries from './pages/newEntries'
import NotificationsScreen from './pages/notifications'
import { Linking } from 'react-native';

function CustomDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
        label="Help"
        onPress={() => Linking.openURL('https://mywebsite.com/help')}
      />
      </DrawerContentScrollView>
    );
  }

export default function Routes(){
    
    return(
        <NavigationContainer>
         
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Screen name="Main" component={Main}/>
                <Screen name="Entries" component={Entries}/>
                <Screen name="NewEntries" component={NewEntries}/>
                <Screen name="Notifications" component={NotificationsScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}