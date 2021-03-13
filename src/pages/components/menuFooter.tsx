import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Entypo, Ionicons, MaterialIcons} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainContext } from '../../contexts/mainContext';
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import { StylesContext } from '../../contexts/stylesContext';


export default function Footer(){

    const activeItemColor = '#3C93F9'
    const nonActiveItemColor = 'rgba(60, 147, 249, 0.5)'

    const navigation = useNavigation()
    const route = useRoute()
    const {resetDate} = useContext(MainContext)
    const {typeOfEntrie, updateEntrieIdUpdate, resetValues } = useContext(NewEntriesContext)
    const {resetValuesForm} = useContext(StylesContext)

    function handleHome(){
        navigation.navigate('Main')
        resetDate()
        resetValuesForm()
        updateEntrieIdUpdate(0)
        resetValues()
    }
    function handleEarnings(){
        navigation.navigate('Entries', { item: 'Ganhos'})
        updateEntrieIdUpdate(0)
        resetValues()
    }
    function handleExpanses(){
        navigation.navigate('Entries', { item: 'Despesas'})
        updateEntrieIdUpdate(0)
        resetValues()
    }
    function handleNotification(){
        navigation.navigate('Notifications')
        updateEntrieIdUpdate(0)
        resetValues()
    }


    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={handleHome}>
                 <Entypo name="home" size={40} color={route.name=="Main"?activeItemColor:nonActiveItemColor}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEarnings}>
                 <Ionicons 
                    name="arrow-up-circle" 
                    size={40} 
                    color={route.name=="Entries" && typeOfEntrie == 'Ganhos'? activeItemColor: nonActiveItemColor}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExpanses}>
                <Ionicons 
                    name="arrow-down-circle" 
                    size={40} 
                    color={route.name=="Entries" && typeOfEntrie == "Despesas" ? activeItemColor: nonActiveItemColor} 
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotification}>
                <Ionicons name="notifications" size={40} color={route.name=="Notifications"?activeItemColor:nonActiveItemColor} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        height:96,
        flexDirection: 'row',
        paddingHorizontal:30,
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:"#ffffff",
        borderTopRightRadius: 40,
        borderTopLeftRadius:40,
        elevation:20,
        shadowColor: '#CAD3DD',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        bottom:0,
    },
})