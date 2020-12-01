import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';


import Ganhos from  '../services/ganhos'
import Valores from '../services/valores';


export default function Main() {
  const navigation = useNavigation()

  const [selectedMonth, setSelectedMonth] = useState(10)
  const [selectedYear, setSelectedYear] = useState(2020)
  

  function handleNavigateGanhos() {
    navigation.navigate('Ganhos', { item: 'Ganhos' })
  }
  function handleNavigateDespesas() {
    navigation.navigate('Ganhos', { item: 'Despesas' })
  }
  function handleNavigateNovoGanhos() {
    navigation.navigate('NovoGanho', { item: 'Ganhos' })
  }
  function handleNavigateNovoDespesas() {
    navigation.navigate('NovoGanho', { item: 'Despesas' })
  }



  function handleNextMonth() {
    let nextMonth = selectedMonth + 1
    let nextYear = selectedYear
    if (nextMonth > 12) {
      nextMonth = 1
      nextYear = nextYear + 1
    }
    let teste1
    if (nextMonth < 10) {
      teste1 = nextYear.toString() + '0' + nextMonth.toString()
    } else {
      teste1 = nextYear.toString() + nextMonth.toString()
    }
    Ganhos.findByDate(parseInt(teste1)).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    Valores.findByDate(parseInt(teste1)).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    //console.log(parseInt(teste1))
    setSelectedMonth(nextMonth)
    setSelectedYear(nextYear)
  }

  function handlePrevMonth() {
    let prevMonth = selectedMonth - 1
    let prevYear = selectedYear
    if (prevMonth < 1) {
      prevMonth = 12
      prevYear = prevYear - 1
    }
    setSelectedMonth(prevMonth)
    setSelectedYear(prevYear)
  }

  const todayDate = new Date()
  const CurrentMonth = todayDate.getMonth() + 1
  const CurrentYear = todayDate.getFullYear()

  useEffect(() => {

    setSelectedMonth(CurrentMonth)
    setSelectedYear(CurrentYear)

  }, [])


  return (
    <LinearGradient colors={['#F9CF3C', '#B26A15']} style={styles.container}>
      <StatusBar style="light" translucent />
      <View style={styles.monthView}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Feather name="arrow-left" size={30} color="#1A8289" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {selectedMonth} / {selectedYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Feather name="arrow-right" size={30} color="#1A8289" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <Text style={styles.currentBalanceText}>
            Seu Saldo Atual
            </Text>
          <Text style={styles.currentBalanceTextValue}>
            R$ 5.400,35
            </Text>
        </View>
        <View style={styles.currentBalanceView}>
          <Text style={styles.estimatedBalanceText}>
            Saldo Estimado
            </Text>
          <Text style={styles.estimatedBalanceTextValue}>
            R$ 5.400,35
            </Text>
        </View>
      </View>

      <View style={styles.valuesView}>
        <View style={styles.currentBalanceView}>
          <Text style={styles.earningsText}>
            Ganhos
            </Text>
          <Text style={styles.earningsTextValue}>
            R$ 5.400,35
            </Text>
        </View>
        <View style={styles.currentBalanceView}>
          <Text style={styles.expensesText}>
            Despesas
            </Text>
          <Text style={styles.expensesTextValue}>
            R$ 5.400,35
            </Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.buttonsView}>
          <LinearGradient colors={['#FFFFFF', '#24DBBA22']} start={{ x: -0.1, y: 0.1 }} style={styles.earningsButton}>
            <TouchableOpacity style={styles.earningsButton} onPress={handleNavigateGanhos}>
              <Feather name="dollar-sign" size={40} color="#1A8289" />
              <Text style={styles.earningsTextButton}>Ganhos</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={['#24DBBA', '#2AC4A8']} start={{ x: -0.1, y: 0.1 }} style={styles.plusButton}>
            <TouchableOpacity style={styles.plusButton} onPress={handleNavigateNovoGanhos}>
              <Feather name="plus" size={40} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={styles.buttonsView}>
          <LinearGradient colors={['#FFFFFF', '#CC372822']} start={{ x: -0.1, y: 0.1 }} style={styles.expensesButton}>
            <TouchableOpacity style={styles.expensesButton} onPress={handleNavigateDespesas}>
              <Feather name="dollar-sign" size={40} color="#CC3728" />
              <Text style={styles.expensesTextButton}>Despesas</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={['#F4786C', '#CC3728']} start={{ x: -0.1, y: 0.1 }} style={styles.plusButton}>
            <TouchableOpacity style={styles.plusButton} onPress={handleNavigateNovoDespesas}>
              <Feather name="plus" size={40} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

      {/* Nos próximos dias, aqui será mostrado os ganhos/despesas mais próximos */}

        <View style={styles.nextDaysView}>
          <Text style={styles.nextDaysText}>Nos próximos dias...</Text>
        </View>

        <View style={styles.nextDaysContent}>
          <Text style={[styles.nextDaysContentText, { color: '#1A8289' }]}>Sálario</Text>
          <Text style={[styles.nextDaysContentText, { color: '#1A8289' }]}>15 Nov</Text>
        </View>
        <View style={styles.nextDaysContent}>
          <Text style={[styles.nextDaysContentText, { color: '#CC3728' }]}>Apartamento</Text>
          <Text style={[styles.nextDaysContentText, { color: '#CC3728' }]}>20 Nov</Text>
        </View>
        <View style={styles.nextDaysContent}>
          <Text style={[styles.nextDaysContentText, { color: '#CC3728' }]}>Cartão de Crédito</Text>
          <Text style={[styles.nextDaysContentText, { color: '#CC3728' }]}>20 Nov</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
  },
  monthView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 13,
  },
  monthText: {
    color: "#1A8289",
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginHorizontal: 5
  },

  balanceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 26,
    marginTop: 13,
  },

  currentBalanceView: {
    justifyContent: 'center',
    marginHorizontal: 26,
  },

  currentBalanceText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  currentBalanceTextValue: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },

  estimatedBalanceText: {
    color: 'rgba(255, 255, 255, 0.62);',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  estimatedBalanceTextValue: {
    color: 'rgba(255, 255, 255, 0.62);',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },


  valuesView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 26,
    marginTop: 32,
  },

  earningsText: {
    color: '#BFFDCC',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  earningsTextValue: {
    color: '#BFFDCC',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },

  expensesText: {
    color: '#FFE1E1',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  expensesTextValue: {
    color: '#FFE1E1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },

  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 33,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    justifyContent: 'flex-start'
  },

  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 38,
  },

  earningsButton: {
    borderStyle: 'solid',
    borderRadius: 20,
    borderColor: '#24DBBA',
    borderWidth: 1,
    height: 83,
    width: 207,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
  },

  expensesButton: {
    borderStyle: 'solid',
    borderRadius: 20,
    borderColor: '#CC3728',
    borderWidth: 1,
    height: 83,
    width: 207,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
  },


  earningsTextButton: {
    color: "#1A8289",
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
  },

  expensesTextButton: {
    color: "#CC3728",
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
  },

  plusButton: {
    width: 91,
    height: 83,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
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

  nextDaysContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginHorizontal: 26,
    borderColor: 'transparent',
    borderBottomColor: '#dadada',
    borderWidth: 1,

  },

  nextDaysContentText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  }

});