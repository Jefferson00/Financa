import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, Platform, KeyboardAvoidingView, Modal, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import MenuFooter from  '../components/menuFooter'
import { ScrollView } from 'react-native-gesture-handler';

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB'
import Functions from '../../functions/index'

import Header from "../components/header"
import ButtonSubmit from "./components/button"
import FormContentCreate from "./components/formContentCreate"
import FormContentUpdate from "./components/formContentUpdate"
import ButtonNewValue from "./components/buttonNewValue"
import FormContent from "./components/formContent"
import SuccessModal from "./components/modal"

import LoaderUpdate from "./components/loaderUpdate"
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import { StylesContext } from '../../contexts/stylesContext';



export default function NewEntries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const { item } = route.params

    const {updateTypeOfEntrie, entrieIdUpdate, typeOfEntrie} = useContext(NewEntriesContext)
    const {entriePrimaryColor, isValuesFormVisible, showValuesForm, resetSelectedEntrieId} = useContext(StylesContext)

    useEffect(()=>{
        updateTypeOfEntrie(item)
        resetSelectedEntrieId()
        entrieIdUpdate!=0 && showValuesForm()
    },[item])
   
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
           <LinearGradient 
            colors={[entriePrimaryColor, '#F9CF3C']} 
            start={{ x: -0.4, y: 0.1 }} 
            style={styles.container}
            >
            <StatusBar style="light" translucent />  
            {entrieIdUpdate == 0 && <Header/>}

             <View style={styles.mainContainer}>
                <View style={styles.tittleTextView}>
                    <Text style={[styles.tittleText, { color: entriePrimaryColor }]}>
                        { entrieIdUpdate == 0 ?
                            typeOfEntrie == "Ganhos" ? "Novo Ganho" : "Nova Despesa"
                        :
                            typeOfEntrie == "Ganhos" ? "Editar Ganho" : "Editar Despesa"
                        }
                    </Text>
                </View>

                <ScrollView style={{ maxHeight: '100%' }}>
                    <View style={styles.formView}>
                        <FormContent/>

                        {isValuesFormVisible && <FormContentCreate/>}
                        
                        <ButtonNewValue/>
                    </View>
                </ScrollView>
                        <ButtonSubmit/>

                <MenuFooter/>
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
})

