import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useColorScheme, Text, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar';
import MenuFooter from '../components/menuFooter'
import { StylesContext } from '../../contexts/stylesContext';
import Header from './components/header';
import { SecurityContext } from '../../contexts/securityContext';

export default function Security() {
    const colorScheme = useColorScheme()
    const { isDarkTheme, entriePrimaryColor, entrieSecondaryColor} = useContext(StylesContext)
    const {isSecurityEnable,toggleSwitchSecurity} = useContext(SecurityContext)

    let containerBgColor = "#ffffff"
    let fromBackgroundColor
    let toBackgroundColor
    let textColor
    let subTextColor
    ///colors schemes

    if (colorScheme == 'dark' || isDarkTheme) {
        containerBgColor = "#090909"
    } else {
        containerBgColor = "#ffffff"
    }

    if (colorScheme === "dark" || isDarkTheme) {
        fromBackgroundColor = '#0851A7'
        toBackgroundColor = '#0A0500'
        textColor = '#ffffff'
        subTextColor = "rgba(255, 255, 255, 0.6)"
    } else {
        fromBackgroundColor = '#FEBD1C'
        toBackgroundColor = '#FF981E'
        textColor = '#444444'
        subTextColor = "rgba(63, 61, 86, 0.8)"
    }

    

    return (
        <LinearGradient colors={[fromBackgroundColor, toBackgroundColor]} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
            <StatusBar style="light" translucent />

            <Header />

            {/*Container Principal*/}
            <View style={[styles.mainContainer, { backgroundColor: containerBgColor }]}>
                <View style={styles.mainContent}>
                    <View style={styles.itemContent}>
                        <View>
                            <Text style={[styles.itemContentText, {color:textColor}]}>
                                Proteção do aplicativo
                            </Text>
                            <Text style={[styles.itemContentSubText, {color:subTextColor}]}>
                                Usar senha para acessar o aplicativo?
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#d2d2d2', true: "#3C93F9" }}
                            thumbColor={isSecurityEnable ? "#2673CE" : "#efefef"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchSecurity}
                            value={isSecurityEnable}
                            style={{ marginTop: 15 }}
                        />
                    </View>
                </View>

                <MenuFooter />

            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },

    mainContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        marginHorizontal: 20,
        marginVertical: 30,
        borderRadius: 20,
    },
    itemContent:{
        borderBottomWidth:1,
        borderBottomColor:"#d2d2d2",
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        marginHorizontal:25,
        marginTop:35,
        paddingBottom:10,
    },
    itemContentText:{
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
    itemContentSubText:{
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 21,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start'
    },
});
