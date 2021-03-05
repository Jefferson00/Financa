import React, { useContext, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import Header from "../components/header"
import MenuFooter from '../components/menuFooter'
import LatestTransations from './components/latestTransactions'
import ButtonsSelectors from './components/buttonsSelectors';
import BalanceView from './components/balanceView';
import EarningsView from './components/earningsView';
import ExpansesView from './components/expansesView';
import { MainContext} from '../../contexts/mainContext';
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import { StylesContext } from '../../contexts/stylesContext';


export default function Main() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const {isBalanceActive, isExpansesActive, isEarningsActive} = useContext(MainContext);

  const {updateMonthColorMainScreen} = useContext(StylesContext)

  //const isFocused = useIsFocused()

  useEffect(()=>{
    if(navigation.isFocused()){
      updateMonthColorMainScreen()
    }
  },[isFocused])

  return (
    <LinearGradient colors={['#F9CF3C', '#B26A15']} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
      <StatusBar style="light" translucent />

      <Header/>

          <ButtonsSelectors/>

          {isBalanceActive && <BalanceView/>}

          {isEarningsActive &&  <EarningsView/>}

          {isExpansesActive &&  <ExpansesView/>}

      {/*Container Principal*/}
      <View style={styles.mainContainer}>
       
          <View style={{flex:1}}>
              <LatestTransations/>
          </View>

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

  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 33,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    justifyContent: 'flex-start'
  },

  nextDaysView: {
    paddingHorizontal: 26,
    marginTop: 25,
    marginBottom: 25,
  },

  nextDaysText: {
    color: '#15695A',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },

});