import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, RefreshControl } from 'react-native'
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
import { StylesContext } from '../../contexts/stylesContext';
import { DataBDContext } from '../../contexts/dataBDContext';
import LoaderBalance from './components/loaderBalance';


export default function Entries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigationScreen = useNavigation()
    const { item } = route.params
    const isFocused = useIsFocused()

    const {updateTypeOfEntrie} = useContext(NewEntriesContext)
    const {isEntriesDone} = useContext(DataBDContext)
    const {firstGradientColor, secondGradientColor, selectedEntrieId, onMonted, onUnmonted, isRendered} = useContext(StylesContext)

    useEffect(()=>{
        updateTypeOfEntrie(item)
    },[item])
   
    useEffect(()=>{
        onMonted()
    },[])

    useEffect(()=>{
        return onUnmonted()
    })
  

    return (
        <LinearGradient
            colors={[firstGradientColor, secondGradientColor]}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
            <StatusBar style="light" translucent />
            <Header/>
            {isEntriesDone ?
                <Balance/>
                :
                <LoaderBalance/>
            }

            <View style={styles.mainContainer}>
                {isEntriesDone ?
                    <EntriesResults/>
                    :
                    <Loader/>
                }
               
            

                <ButtonNewEntrie/>

                <MenuFooter/>
            </View>
            {selectedEntrieId != 0 && selectedEntrieId != undefined && <ModalContent/>}

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
