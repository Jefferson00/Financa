import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { StylesContext } from '../../contexts/stylesContext'

import MenuFooter from '../components/menuFooter'
import Header from './components/header'
import Results from './components/results'

export default function NotificationsScreen() {

    const {colorScheme, isDarkTheme} = useContext(StylesContext)

    let gradientColors = []
    let mainContainerBgColor = ""

    colorScheme == "dark" || isDarkTheme ? gradientColors = ['#0851A7', '#000000'] : gradientColors = ['#3C93F9', '#1579B2']
    colorScheme == "dark" || isDarkTheme ? mainContainerBgColor = "#080808" : mainContainerBgColor = "#ffffff"

    return(
        <LinearGradient
            colors={gradientColors}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}
        >
            <Header/>
            <View style={[styles.mainContainer, {backgroundColor:mainContainerBgColor}]}>

                <Results/>
                <MenuFooter/>
            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 26,
    },
    mainContainer:{
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 33,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start',
    }
})