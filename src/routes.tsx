import React, { useContext } from 'react'

import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const {Navigator, Screen} = createStackNavigator();

import Main from './pages/main'
import Entries from './pages/entries'
import NewEntries from './pages/newEntries'
import NotificationsScreen from './pages/notifications'
import { Appearance, Linking } from 'react-native';
import { StylesContext } from './contexts/stylesContext';
import { DrawerActions } from '@react-navigation/native'


function CustomDrawerContent(props: any) {
    const {changeTheme} = useContext(StylesContext)

    

    function closeSideBar(){
       props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    function toDarkTheme(){
        closeSideBar()
        changeTheme()
    }

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
        label="Mudar o tema"
        onPress={() => toDarkTheme()}

      />

      </DrawerContentScrollView>
    );
  }

const StackNav = () =>{
    return(
        <Navigator screenOptions={{headerShown:false}}>
                <Screen name="Main" component={Main}/>
                <Screen name="Entries" component={Entries}/>
                <Screen name="NewEntries" component={NewEntries}/>
                <Screen name="Notifications" component={NotificationsScreen}/>
        </Navigator>
    )
}

const DrawerNav = () =>{
    return(
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Screen name="Home" component={StackNav}/>
        </Drawer.Navigator>
    )
}

export default function Routes(){
    return(
        <NavigationContainer>
            <DrawerNav/>
        </NavigationContainer>
    )
}