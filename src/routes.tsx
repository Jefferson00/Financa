import React, { useContext } from 'react'

import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { StylesContext } from './contexts/stylesContext';
import { DrawerActions } from '@react-navigation/native';

const {Navigator, Screen} = createStackNavigator();
const Drawer = createDrawerNavigator();

import Main from './pages/main'
import Entries from './pages/entries'
import NewEntries from './pages/newEntries'
import NotificationsScreen from './pages/notifications'
import { View, Text } from 'react-native';

function CustomDrawerContent(props: any) {
    const {changeTheme, colorScheme, isDarkTheme} = useContext(StylesContext)
    //const navigation = useNavigation()

    let DrawerBgColor = ""
    let itemBgColor = ""
    let itemTextColor = ""
    let lebelText = ""
    let menuViewBgColor = ""
    colorScheme == 'dark' || isDarkTheme ? DrawerBgColor = "#2a2a2a" : DrawerBgColor = "#ffffff"
    colorScheme == 'dark' || isDarkTheme ? itemBgColor = "#383838" : itemBgColor = "#ffffff"
    colorScheme == 'dark' || isDarkTheme ? itemTextColor = "#ffffff" : itemTextColor = "#2a2a2a"
    colorScheme == 'dark' || isDarkTheme ? menuViewBgColor = "#0851A7" : menuViewBgColor = "#3C93F9"
    isDarkTheme ? lebelText = "Desativar tema escuro" : lebelText = "Ativar tema escuro"

    function closeSideBar(){
       props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    function toDarkTheme(){
        //closeSideBar()
        changeTheme()
    }

    function Content(){
        return(
            <View style={{
                height:150,
                backgroundColor: menuViewBgColor,
                justifyContent:'center',
                alignItems:'center'
                }}>
                <Text style={{
                     fontSize: 18,
                     fontFamily: 'Poppins_500Medium',
                     color:'#ffffff'
                }}>
                    Menu
                </Text>
            </View>
        )
    }

    return (
      <DrawerContentScrollView {...props}
        style={{backgroundColor:DrawerBgColor}}
      >
            <Content/>
            <DrawerItem
                label= "Home"
                labelStyle={{
                    fontSize: 14,
                    fontFamily: 'Poppins_500Medium',
                    color:itemTextColor
                }}
                inactiveTintColor={itemTextColor}
                inactiveBackgroundColor = {itemBgColor}
                style={[
                    {borderRadius:20, 
                    paddingLeft:20, 
                    marginVertical:15},
                    (colorScheme != 'dark' || !isDarkTheme) &&
                    {borderWidth:1,borderColor:'#b0b0b0'}
                ]}
                onPress={() =>  props.navigation.navigate('Main')}
            />
            <DrawerItem
                label= {lebelText}
                labelStyle={{
                    fontSize: 14,
                    fontFamily: 'Poppins_500Medium',
                    color:itemTextColor
                }}
                inactiveTintColor={itemTextColor}
                inactiveBackgroundColor = {itemBgColor}
                style={[
                    {borderRadius:20, 
                    paddingLeft:20, 
                    marginVertical:15},
                    (colorScheme != 'dark' || !isDarkTheme) &&
                    {borderWidth:1,borderColor:'#b0b0b0'}
                ]}
                onPress={() => toDarkTheme()}
            />
            <DrawerItem
                labelStyle={{
                    fontSize: 14,
                    fontFamily: 'Poppins_500Medium',
                    color:itemTextColor
                }}
                label= "Notificações"
                inactiveTintColor={itemTextColor}
                inactiveBackgroundColor = {itemBgColor}
                style={[
                    {borderRadius:20, 
                    paddingLeft:20, 
                    marginVertical:15},
                    (colorScheme != 'dark' || !isDarkTheme) &&
                    {borderWidth:1,borderColor:'#b0b0b0'}
                ]}
                onPress={() => props.navigation.navigate('Notifications')}
            />
            <DrawerItem
                labelStyle={{
                    fontSize: 14,
                    fontFamily: 'Poppins_500Medium',
                    color:'#ffffff'
                }}
                label= "Excluir dados"
                inactiveTintColor={itemTextColor}
                inactiveBackgroundColor = "#CC3728"
                style={[
                    {borderRadius:20, 
                    paddingLeft:20, 
                    marginVertical:15}
                ]}

                onPress={() => props.navigation.navigate('Notifications')}
            />

            <View style={{
                flex:1, 
                justifyContent:'flex-end', 
                alignItems:'center',
                marginTop:50,
                }}>
                <Text style={{color:itemTextColor}}>
                    Versão 1.1.0
                </Text>
            </View>
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