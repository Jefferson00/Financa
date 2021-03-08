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
import { DataBDContext } from '../../contexts/dataBDContext';

interface EntriesValuesData{
  id:number,
  description: string,
  amount: number,
  dtStart: number,
  dtEnd: number,
  entries_id: number,
  day: number,
  type: string,
  received: boolean,
}

interface BalanceValues{
  currentBalance:number,
  estimatedBalance:number,
  remainingBalance:number,
  totalEstimatedBalance:number,
}

interface EarningsValues{
  currentEarnings:number,
  estimatedEarnings:number
}

interface ExpansesValues{
  currentExpanses:number,
  estimatedExpanses:number
}

interface BalanceData{
  month:number,
  year:number,
  amount: number
}

export default function Main() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const {isBalanceActive, isExpansesActive, isEarningsActive, selectedMonth, selectedYear} = useContext(MainContext);
  const {balances} = useContext(DataBDContext)

  const {updateMonthColorMainScreen} = useContext(StylesContext)

  //const isFocused = useIsFocused()

  useEffect(()=>{
    if(navigation.isFocused()){
      updateMonthColorMainScreen()
    }
  },[isFocused])

  const {entriesValuesByDate} = useContext(DataBDContext)

  let earningsValuesArrays : Array<number> = []
  let expansesValuesArrays : Array<number> = []
  let estimatedEarningsArrays : Array<number> = []
  let estimatedExpansesArrays : Array<number> = []

  entriesValuesByDate.map((value:EntriesValuesData)=>{
    if(value.amount !=0 && value.received){
      value.type == 'Ganhos' ? earningsValuesArrays.push(value.amount) : expansesValuesArrays.push(value.amount)  
    }
    if(value.amount !=0){
      value.type == 'Ganhos' ? estimatedEarningsArrays.push(value.amount) : estimatedExpansesArrays.push(value.amount)  
    }
  })

  let currentEarnings = earningsValuesArrays.reduce((a: any, b: any) => a + b, 0) 
  let currentExpanses =  expansesValuesArrays.reduce((a: any, b: any) => a + b, 0)
  let currentBalance = currentEarnings - currentExpanses
  
  let estimatedEarnings = estimatedEarningsArrays.reduce((a: any, b: any) => a + b, 0)
  let estimatedExpanses = estimatedExpansesArrays.reduce((a: any, b: any) => a + b, 0)
  let estimatedBalance = estimatedEarnings - estimatedExpanses

  
  let remainingBalance = 0
  let totalEstimatedBalance = 0
  
  
  balances.map((bal: BalanceData, index: number) => {
    if (bal.year == selectedYear && bal.month == selectedMonth) {
      remainingBalance = bal.amount - (estimatedEarnings - estimatedExpanses)
      totalEstimatedBalance = bal.amount
    }
  })
  
  let balanceValuesProps: BalanceValues = {currentBalance,estimatedBalance,remainingBalance,totalEstimatedBalance}
  let earningsValuesProps: EarningsValues= {currentEarnings,estimatedEarnings}
  let expansesValuesProps: ExpansesValues= {currentExpanses, estimatedExpanses}

  return (
    <LinearGradient colors={['#F9CF3C', '#B26A15']} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
      <StatusBar style="light" translucent />

      <Header/>

          <ButtonsSelectors/>

          {isBalanceActive && <BalanceView values={balanceValuesProps}/>}

          {isEarningsActive &&  <EarningsView values={earningsValuesProps}/>}

          {isExpansesActive &&  <ExpansesView values={expansesValuesProps}/>}

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

