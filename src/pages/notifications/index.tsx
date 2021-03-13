import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert } from 'react-native'

import MenuFooter from '../components/menuFooter'
import Header from './components/header'
import Results from './components/results'

export default function NotificationsScreen() {


    return(
        <LinearGradient
            colors={['#3C93F9', '#1579B2']}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}
        >
            <Header/>
            <View style={styles.mainContainer}>

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