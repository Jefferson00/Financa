import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Entypo, Ionicons, MaterialIcons} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Footer(){

    const activeItemColor = '#1A8289'
    const nonActiveItemColor = 'rgba(26, 130, 137, 0.5)'

    const navigation = useNavigation()
    const route = useRoute()

    function handleHome(){
        navigation.navigate('Main')
    }
    function handleProfile(){
        navigation.navigate('Entries', { item: 'Ganhos'})
    }


    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={handleHome}>
                 <Entypo name="home" size={40} color={route.name=="Main"?activeItemColor:nonActiveItemColor}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfile}>
                 <Ionicons name="person" size={40} color={nonActiveItemColor} />
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="analytics" size={40} color={nonActiveItemColor} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="notifications" size={40} color={nonActiveItemColor} />
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
        position:'absolute',
        bottom:0,
        zIndex:5,
        left:0,
        right:0,
        elevation:20,
        shadowColor: '#CAD3DD',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
    },
})