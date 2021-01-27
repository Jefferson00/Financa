import React, { useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Feather, Foundation } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB'
import Dates from '../../services/dates'
import Functions from '../../functions/index'

import Header from "../components/header"
import BalanceValues from "./components/balanceValues"
import NextDays from "./components/nextDays"
import ModalContent from './components/modalContent'

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useStylesStates} from '../../contexts/stylesStates'
import {useResultsDB} from "../../contexts/resultsDBStates"


export default function Main() {
  const navigation = useNavigation()

  const {selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, setNoBalance} = useSelectedMonthAndYear();
  const {setMonthColor, primaryColor, setPrimaryColor, secondColor, setSecondColor, setModalBalance, setTextModal, setModalType} = useStylesStates();
  const {setEntries,setBalance,setNextEntries,setNextEntries2,setValuesList}  = useResultsDB();


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
    setModalType("Balance")

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
      if (navigation.isFocused()){
        setPrimaryColor('#1B5AA4')
        setSecondColor('#F9CF3C')
        setMonthColor('#FFFFFF')
      }
    } else {
      if (navigation.isFocused()){
        setPrimaryColor('#F9CF3C')
        setSecondColor('#B26A15')
        setMonthColor('#1A8289')
      }
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
      setMonthColor('#1A8289')
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
    CurrentMonth, 
    CurrentYear,
    showModalBalance,
    todayDate,
  }

  return (
    <LinearGradient colors={[primaryColor, secondColor]} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
      <StatusBar style="light" translucent />

      <Header props={null}></Header>

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

        <NextDays functions={fct}></NextDays>

      </View>

          <ModalContent></ModalContent>

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

});