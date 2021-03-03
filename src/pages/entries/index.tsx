import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import MenuFooter from  '../components/menuFooter'
import Header from "../components/header"
import ModalContent from "./components/modalContent"
import Balance from "./components/balance"
import EntriesResults from "./components/entriesResults"
import ButtonNewEntrie from "./components/buttonNewEntrie"
import NoResultsView from "./components/noResultsView"

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB';

import Functions from "../../functions"

import { EntriesValues, ValuesItemUpdate, ValuesValues } from '../../interfaces';
import Loader from './components/loader';
import { NewEntriesContext } from '../../contexts/newEntriesContext';


export default function Entries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigationScreen = useNavigation()
    const { item } = route.params

    const {updateTypeOfEntrie} = useContext(NewEntriesContext)

    useEffect(()=>{
        updateTypeOfEntrie(item)
    },[item])
   
  

    return (
        <LinearGradient
            colors={['#d2d2d2', '#d2d2d2']}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
            <StatusBar style="light" translucent />
            <Header/>

            <Balance/>

            <View style={styles.mainContainer}>
            
                <EntriesResults/>
           
               
            

                <ButtonNewEntrie/>

                <MenuFooter/>
            </View>


            

        </LinearGradient>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },

    //Main Container
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 33,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start',
    },
})
