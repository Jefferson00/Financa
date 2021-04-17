import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, Platform, KeyboardAvoidingView, Modal, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';
import { DrawerActions } from '@react-navigation/native'

import MenuFooter from '../components/menuFooter'
import { ScrollView } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons'

import Header from "../components/header"
import ButtonSubmit from "./components/button"
import FormContentCreate from "./components/formContentCreate"
import ButtonNewValue from "./components/buttonNewValue"
import FormContent from "./components/formContent"
import SuccessModal from "./components/modal"

import LoaderUpdate from "./components/loaderUpdate"
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import { StylesContext } from '../../contexts/stylesContext';



export default function NewEntries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const { item } = route.params

    
    const nav = useNavigation()

    function openSidebar(){
        nav.dispatch(DrawerActions.openDrawer())
    }

    const { updateTypeOfEntrie, entrieIdUpdate, typeOfEntrie } = useContext(NewEntriesContext)
    const { entriePrimaryColor, isValuesFormVisible, showValuesForm, resetSelectedEntrieId, isDarkTheme, colorScheme } = useContext(StylesContext)
    const {monthColor} = useContext(StylesContext)

    let containerBgColor = ""
    let earningsGradientColors = [""]
    let expansesGradientColors = [""]

    colorScheme == "dark" || isDarkTheme ? containerBgColor = "#2B2B2B" : containerBgColor = "#FFFFFF"

    if (colorScheme == 'dark' || isDarkTheme) {
        earningsGradientColors = ["#136065", "#000000"]
        expansesGradientColors = ["#A5291D", "#000000"]
    } else {
        earningsGradientColors = ["#155F69", "#F9CF3C"]
        expansesGradientColors = ["#CC3728", "#F9CF3C"]
    }


    useEffect(() => {
        updateTypeOfEntrie(item)
        resetSelectedEntrieId()
        entrieIdUpdate != 0 && showValuesForm()
    }, [item])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <LinearGradient
                colors={item == "Ganhos" ? earningsGradientColors : expansesGradientColors}
                start={{ x: -0.4, y: 0.1 }}
                style={styles.container}
            >
                <StatusBar style="light" translucent />
                {entrieIdUpdate == 0 ? <Header />
                    :
                    <View style={styles.headerView}>
                        <View style={styles.monthView}>
                            <TouchableOpacity hitSlop={styles.hitSlop}>
                                <Feather name="arrow-left" size={40} color={monthColor} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.monthView}>
                            <TouchableOpacity onPress={openSidebar} hitSlop={styles.hitSlop}>
                                <Feather name="menu" size={25} color={monthColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                <View style={[styles.mainContainer, { backgroundColor: containerBgColor }]}>
                    <View style={styles.tittleTextView}>
                        <Text style={[styles.tittleText, { color: entriePrimaryColor }]}>
                            {entrieIdUpdate == 0 ?
                                typeOfEntrie == "Ganhos" ? "Novo Ganho" : "Nova Despesa"
                                :
                                typeOfEntrie == "Ganhos" ? "Editar Ganho" : "Editar Despesa"
                            }
                        </Text>
                    </View>

                    <ScrollView style={{ maxHeight: '100%' }}>
                        <View style={styles.formView}>
                            <FormContent />

                            {isValuesFormVisible && <FormContentCreate />}

                            <ButtonNewValue />
                        </View>
                        <ButtonSubmit />
                    </ScrollView>

                    <MenuFooter />
                </View>

            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },
    tittleTextView: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formView: {
        marginHorizontal: 43
    },


    tittleText: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 33,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start',
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
      },
      monthView:{
        flexDirection: 'row',
        alignItems: 'center'
      },
      hitSlop:{
        top:20,
        bottom:20,
        left:30,
        right:30,
      },
})

