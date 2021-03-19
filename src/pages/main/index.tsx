import React, { useContext, useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


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
import ChartView from './components/chartView';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

declare type Subscription = {
  remove: () => void;
};

export default function Main() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [expoPushToken, setExpoPushToken] = useState<any>('');
  const [notification, setNotification] = useState<any>(false);
 
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const {isBalanceActive, isExpansesActive, isEarningsActive, selectedMonth, todayDate, selectedYear} = useContext(MainContext);
  const {balances, entriesByCurrentDate } = useContext(DataBDContext)

  const {updateMonthColorMainScreen, updateHasNotification} = useContext(StylesContext)
  
  let latedEarningEntries = entriesByCurrentDate.filter(entrie => !entrie.received && entrie.day <= todayDate.getDate() && entrie.type == "Ganhos")
  let latedExpansesEntries = entriesByCurrentDate.filter(entrie => !entrie.received && entrie.day <= todayDate.getDate() && entrie.type == "Despesas")
  //const isFocused = useIsFocused()

  useEffect(()=>{
    if(navigation.isFocused()){
      updateMonthColorMainScreen()

      if (latedEarningEntries.length > 0 || latedExpansesEntries.length > 0){
        updateHasNotification(true)
      }else{
        updateHasNotification(false)
      }
    }
  },[isFocused])

  useEffect(()=>{
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
      console.log('length: '+latedEarningEntries.length)
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
        let notficationDate = new Date()
        notficationDate.setHours(22)
        console.log(notficationDate)
        if(latedEarningEntries.length > 0){
          schedulePushNotification('ganhos não recebidos!', notficationDate)
        }
        if(latedExpansesEntries.length > 0){
          schedulePushNotification('Despesas não pagas!', notficationDate)
        }
       
        //schedulePushNotification()
      };
  },[])

  const schedulePushNotification = async (title: string, notficationDate: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
          title: title,
          body: 'text here',
          data: {
          //more data here
          }
        },
      trigger: {
        repeats: false,
        seconds: notficationDate.getSeconds(),
      },
  
    })
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  };
  

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
          <ChartView/>
       
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
    marginTop: 21,
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

