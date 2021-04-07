import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, RefreshControl } from 'react-native'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
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
import Loader from './components/loaders/loader';
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import { StylesContext } from '../../contexts/stylesContext';
import { DataBDContext } from '../../contexts/dataBDContext';
import LoaderBalance from './components/loaders/loaderBalance';
import LoaderMonth from './components/loaders/loaderMonth';
import LoaderButton from './components/loaders/loaderButton';
import LoaderMenu from './components/loaders/loaderMenu';


export default function Entries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigationScreen = useNavigation()
    const { item } = route.params
    const isFocused = useIsFocused()
    const routeNav = useRoute()

    const {updateTypeOfEntrie} = useContext(NewEntriesContext)
    const {isEntriesDone} = useContext(DataBDContext)
    const {selectedEntrieId, onMonted, onUnmonted, isRendered, colorScheme, isDarkTheme} = useContext(StylesContext)

    let earningsGradientColors = [""]
    let expansesGradientColors = [""]

    if(colorScheme == 'dark' || isDarkTheme){
        earningsGradientColors = ["#136065","#000000"]
        expansesGradientColors = ["#A5291D","#000000"]
    }else{
        earningsGradientColors = ["#155F69","#F9CF3C"]
        expansesGradientColors = ["#CC3728","#F9CF3C"]
    }

    useEffect(()=>{
        updateTypeOfEntrie(item)
    },[item])

    useEffect(()=>{
       
        isEntriesDone ? onMonted() : onUnmonted()
    },[routeNav.name,routeNav.params])

  

    return (
        <LinearGradient
            colors={item == "Ganhos" ? earningsGradientColors : expansesGradientColors}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
            <StatusBar style="light" translucent />
            {isRendered ?
                <Header/>
            :
                <LoaderMonth/>
            }
            {isRendered && isEntriesDone?
                <Balance/>
                :
                <LoaderBalance/>
            }

            <View style={[styles.mainContainer, (colorScheme == 'dark' || isDarkTheme)  && {backgroundColor:"#090909"}]}>
                {isRendered && isEntriesDone?
                    <EntriesResults/>
                    :
                    <Loader/>
                }
               
               {isRendered ?
                    <ButtonNewEntrie/>
                    :
                    <LoaderButton/>
                }
               
               {isRendered ?
                    <MenuFooter/>
                    :
                    <LoaderMenu/>
                }
                

                
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
