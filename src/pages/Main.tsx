import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { Feather, AntDesign, Foundation } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';

import EntriesDB from '../services/entriesDB'
import ValuesDB from '../services/valuesDB'
import Dates from '../services/dates'
import Functions from '../functions/index'

import Header from "./components/header"
import BalanceValues from "./components/balanceValues"

import {useSelectedMonthAndYear} from '../contexts/selectMonthAndYear'
import {useStylesStates} from '../contexts/stylesStates'
import {useResultsDB} from "../contexts/resultsDBStates"

export default function Main() {
  const navigation = useNavigation()

  const {selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, noBalance, setNoBalance} = useSelectedMonthAndYear();
  const {setMonthColor, primaryColor, setPrimaryColor, secondColor, setSecondColor} = useStylesStates();
  const {
    entries,
    setEntries,
    balance,
    setBalance,
    nextEntries,
    setNextEntries,
    nextEntries2,
    setNextEntries2,
    valuesList,
    setValuesList,
  }  = useResultsDB();

  const [modalBalance, setModalBalance] = useState(false)
  const [textModal, setTextModal] = useState('')


  //  Define a data atual
  const todayDate = new Date()
  const CurrentMonth = todayDate.getMonth() + 1
  const CurrentYear = todayDate.getFullYear()

  // Arrays
  let datas: any = []

  // funções de navegação
  function handleNavigateGanhos() {
    navigation.navigate('Entries', { item: 'Ganhos', month: selectedMonth, year: selectedYear })
  }
  function handleNavigateDespesas() {
    navigation.navigate('Entries', { item: 'Despesas', month: selectedMonth, year: selectedYear })
  }
  function handleNavigateNovoGanhos() {
    navigation.navigate('NewEntries', { item: 'Ganhos', month: selectedMonth, year: selectedYear })
  }
  function handleNavigateNovoDespesas() {
    navigation.navigate('NewEntries', { item: 'Despesas', month: selectedMonth, year: selectedYear })
  }

  /**Função que mostra o modal com a explicação dos resultados */
  function showModalBalance(idModal: number) {
    setModalBalance(true)
    if (idModal == 1) {
      setTextModal(`Em seu Saldo atual, o primeiro valor representa o saldo com base nos ganhos recebidos e despesas pagas no mês.
      O segundo valor, representa o valor restante dos meses anteriores.
      `)
    }
    if (idModal == 2) {
      setTextModal('Seu Saldo Estimado representa o valor restante estimado no final do mês com base nos valores totais de ganhos e despesas estimados ')
    }
    if (idModal == 3) {
      setTextModal('O valor superior representa todos os ganhos recebidos no mês. O valor inferior representa os ganhos estimados a serem recebidos até o final do mês ')
    }
    if (idModal == 4) {
      setTextModal('O valor superior representa todos as despesas pagas no mês. O valor inferior representa as despesas estimadas a serem pagas até o final do mês')
    }
  }

  /**Função que mostra os dados do mês seguinte */

  function handleNextMonth() {
    let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
    EntriesDB.findByDate(parseInt(nextDtObj.dt)).then((res: any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(nextDtObj.dt)).then((res: any) => {
      setValuesList(res._array)
      setNoBalance(false)
    }).catch(err => {
      setValuesList([])
      console.log(err)
      setNoBalance(true)
    })

    setSelectedMonth(nextDtObj.nextMonth)
    setSelectedYear(nextDtObj.nextYear)
  }

  /**Função que mostra os dados do mês anterior */
  function handlePrevMonth() {
    let prevDtObj = Functions.prevMonth(selectedMonth, selectedYear)

    EntriesDB.findByDate(parseInt(prevDtObj.dt)).then((res: any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(prevDtObj.dt)).then((res: any) => {
      setValuesList(res._array)
      setNoBalance(false)
    }).catch(err => {
      setValuesList([])
      setNoBalance(true)
      console.log(err)
    })

    setSelectedMonth(prevDtObj.prevMonth)
    setSelectedYear(prevDtObj.prevYear)
  }

  

  /**Função que carrega o Saldo Total com o restante dos meses anteriores */
  async function loadBalance() {
    let sumBalance = 0
    let balanceArray: Array<any> = []
    setBalance([])

    for (const [index, data] of datas.entries()) {
      await ValuesDB.findByDate(parseInt(data)).then((res: any) => {
        let sumEarnings = 0
        let sumExpenses = 0
        for (var t = 0; t < res._array.length; t++) {
          if (res._array[t].type == 'Ganhos') {
            sumEarnings = sumEarnings + res._array[t].amount
          } else if (res._array[t].type == 'Despesas') {
            sumExpenses = sumExpenses + res._array[t].amount
          }
        }
        let balance = sumEarnings - sumExpenses
        sumBalance = sumBalance + balance
        let year = parseInt(Functions.toMonthAndYear(data).year)
        let month = parseInt(Functions.toMonthAndYear(data).month)
        let obj: any = { month: month, year: year, amount: sumBalance }
        if (balanceArray.indexOf(obj) > -1) {

        } else {
          balanceArray.push(obj)
        }
      }).catch(err => {
        console.log(err)
      })
    }
    setBalance(balanceArray)

    balanceArray = []
  }

  useEffect(() => {
    if (selectedMonth != CurrentMonth) {
      setPrimaryColor('#1B5AA4')
      setSecondColor('#F9CF3C')
      setMonthColor('#FFFFFF')
    } else {
      setPrimaryColor('#F9CF3C')
      setSecondColor('#B26A15')
      setMonthColor('#1A8289')
    }
  }, [selectedMonth])

  useEffect(() => {

    setSelectedMonth(CurrentMonth)
    setSelectedYear(CurrentYear)

    /*Verifica se houve mudança de mês, caso sim, atualiza todos os recebidos/pagos como falso*/
    Dates.findByDate(CurrentMonth, CurrentYear).then(() => {

    }).catch(err => {
      console.log(err)
      const DateObj = {
        month: CurrentMonth,
        year: CurrentYear,
      }
      Dates.create(DateObj)
      EntriesDB.updateReceived(false).then(res => {
        console.log('Atualizado!' + res)
      }).catch(err => {
        console.log(err)
      })
      console.log('Mes criado: ' + CurrentMonth)
    })


    const reload = navigation.addListener('focus', () => {
      setSelectedMonth(CurrentMonth)
      setSelectedYear(CurrentYear)
      let firstDate
      /*Converte para a data em String e no formato que é salvo no banco de dados*/
      if (CurrentMonth < 10) {
        firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
      } else {
        firstDate = CurrentYear.toString() + CurrentMonth.toString()
      }
      //Ex: firstDate: '202101'

      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação
      EntriesDB.findByDate(parseInt(firstDate)).then((res: any) => {
        setEntries(res._array)
      }).catch(err => {
        console.log(err)
      })

      //Procura todos os valores correspondente a data atual ao abrir a aplicação
      ValuesDB.findByDate(parseInt(firstDate)).then((res: any) => {
        setValuesList(res._array)
        setNoBalance(false)
      }).catch(err => {
        console.log(err)
        setNoBalance(true)
      })

      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia
      EntriesDB.findByDateOrderByDay(parseInt(firstDate)).then((res: any) => {
        setNextEntries(res._array)
      }).catch(err => {
        console.log(err)
      })

      let nMonth = Functions.nextMonth(CurrentMonth, CurrentYear)
      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia do Mês seguinte
      EntriesDB.findByDateOrderByDay(parseInt(nMonth.dt)).then((res: any) => {
        setNextEntries2(res._array)
      }).catch(err => {
        console.log(err)
      })

      ValuesDB.allOrderByDate().then((res: any) => {
        let dtStart = res._array[0].dtStart
        if (dtStart != undefined) {
          let ano: number = parseInt(Functions.toMonthAndYear(dtStart).year)
          let mes: number = parseInt(Functions.toMonthAndYear(dtStart).month)
          let dateP

          do {
            for (var i = mes; i <= 13; i++) {
              if (i == 13) {
                mes = 1
                ano = ano + 1
              } else {
                if (i < 10) {
                  dateP = ano.toString() + '0' + i.toString()
                } else {
                  dateP = ano.toString() + i.toString()
                }
                datas.push(dateP)
              }
            }
          } while (ano < CurrentYear + 20)
          loadBalance()
        }
      })
      datas = []

    });
    return reload;
  }, [])

  const fct = {
    handleNextMonth,
    handlePrevMonth,
    CurrentMonth, 
    CurrentYear,
    showModalBalance,
  }

  return (
    <LinearGradient colors={[primaryColor, secondColor]} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
      <StatusBar style="light" translucent />

      <Header functions={fct}></Header>

      <BalanceValues functions={fct}></BalanceValues>

      {/*Container Principal*/}
      <View style={styles.mainContainer}>
        {/*Botões Ganhos*/}

        <View style={styles.buttonsView}>
          <LinearGradient colors={['#FFFFFF', '#24DBBA22']} start={{ x: -0.1, y: 0.1 }} style={styles.earningsButton}>
            <TouchableOpacity style={styles.earningsButton} onPress={handleNavigateGanhos}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Foundation name="dollar" size={50} color="#1A8289" style={{ marginRight: 15, marginBottom: 5 }} />
                <Text style={styles.earningsTextButton}>Ganhos</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={['#24DBBA', '#2AC4A8']} start={{ x: -0.1, y: 0.1 }} style={styles.plusButton}>
            <TouchableOpacity style={styles.plusButton} onPress={handleNavigateNovoGanhos}>
              <Feather name="plus" size={40} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/*Botões Despesas*/}

        <View style={styles.buttonsView}>
          <LinearGradient colors={['#FFFFFF', '#CC372822']} start={{ x: -0.1, y: 0.1 }} style={styles.expensesButton}>
            <TouchableOpacity style={styles.expensesButton} onPress={handleNavigateDespesas}>
              <Foundation name="dollar" size={50} color="#CC3728" style={{ marginRight: 15, marginBottom: 5 }} />
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

        <ScrollView style={{ maxHeight: 95, elevation: 5 }}>
          {nextEntries.map((ear, index) => {
            if (ear.day >= todayDate.getDate() && ear.day <= (todayDate.getDate() + 10) && !ear.received) {
              let color
              if (ear.type == 'Ganhos') {
                color = '#1A8289'
              } else {
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day + '  ' + Functions.convertDtToStringMonth(todayDate.getMonth() + 1)}
                  </Text>
                </View>
              )
            }
          })
          }
          {todayDate.getDate() + 5 > 30 && nextEntries2.map((ear, index) => {
            if (ear.day <= 5) {
              let color
              if (ear.type == 'Ganhos') {
                color = '#1A8289'
              } else {
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day + '  ' + Functions.convertDtToStringMonth(todayDate.getMonth() + 2)}
                  </Text>
                </View>
              )
            }
          })}
        </ScrollView>

      </View>

      <Modal animationType="slide" visible={modalBalance} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.questionsModalText}>
                  {textModal}
                </Text>
              <TouchableOpacity onPress={() => { setModalBalance(!modalBalance) }}>
                <Feather name="x" size={30} color={'#136065'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginHorizontal: 5
  },
  questionsModalText:{
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    marginHorizontal: 5,
    color: '#1A8289'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: ' rgba(0, 0, 0, 0.39);',
    justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    height: '50%',
    padding: 30,
    alignItems:'center',
    justifyContent:'center'
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