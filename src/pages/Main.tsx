import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View ,ScrollView, Modal} from 'react-native';
import { Feather, AntDesign  } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';


import EntriesDB from '../services/entriesDB'
import ValuesDB from '../services/valuesDB'
import Dates from '../services/dates'
import Functions from '../functions/index'


export default function Main() {
  const navigation = useNavigation()

  // interfaces
  interface EntriesValues {
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type:string,
  }

  interface ValuesValues {
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
  }

  interface Balance{
    month: number,
    year: number,
    amount: number,
  }

  //
  const [selectedMonth, setSelectedMonth] = useState(10)
  const [selectedYear, setSelectedYear] = useState(2020)
  const [entries, setEntries] = useState<EntriesValues[]>([])
  const [nextEntries, setNextEntries] = useState<EntriesValues[]>([])
  const [nextEntries2, setNextEntries2] = useState<EntriesValues[]>([])
  const [valuesList, setValuesList] = useState<ValuesValues[]>([])
  const [balance, setBalance] = useState<Balance[]>([])
  const [modalBalance, setModalBalance] = useState(false)
  const [textModal, setTextModal] = useState('')
  const [noBalance, setNoBalance] = useState(false)

  const [primaryColor, setPrimaryColor] = useState('#F9CF3C')
  const [secondColor, setSecondColor] = useState('#B26A15')
  const [monthColor, setMonthColor] = useState('#1A8289')

  //  Define a data atual
  const todayDate = new Date()
  const CurrentMonth = todayDate.getMonth() + 1
  const CurrentYear = todayDate.getFullYear()
  
  // Arrays
  let datas: any = []
  let contEarnings: Array<number> = []
  let contEstimatedEarnings: Array<number> = []
  let contExpenses: Array<number> = []
  let contEstimatedExpenses: Array<number> = []

  // funções de navegação
  function handleNavigateGanhos() {
    navigation.navigate('Entries', { item: 'Ganhos' , month: selectedMonth, year: selectedYear})
  }
  function handleNavigateDespesas() {
    navigation.navigate('Entries', { item: 'Despesas' , month: selectedMonth, year: selectedYear})
  }
  function handleNavigateNovoGanhos() {
    navigation.navigate('NewEntries', { item: 'Ganhos', month: selectedMonth, year: selectedYear })
  }
  function handleNavigateNovoDespesas() {
    navigation.navigate('NewEntries', { item: 'Despesas', month: selectedMonth, year: selectedYear })
  }

  /**Função que mostra o modal com a explicação dos resultados */
  function showModalBalance(idModal: number){
    setModalBalance(true)
    if (idModal == 1){
      setTextModal('Seu Saldo Atual representa o valor restante com base nos valores totais de ganhos e despesas recebidos e pagos no mês selecionado. O valor superior indica o saldo atual do Mês, o valor inferior representa o saldo total do Mês mais o restante dos meses anteriores.')
    }
    if (idModal == 2){
      setTextModal('Seu Saldo Estimado representa o valor restante estimado no final do mês com base nos valores totais de ganhos e despesas estimados ')
    }
    if (idModal == 3){
      setTextModal('O valor superior representa todos os ganhos recebidos no mês. O valor inferior representa os ganhos estimados a serem recebidos até o final do mês ')
    }
    if (idModal == 4){
      setTextModal('O valor superior representa todos as despesas pagas no mês. O valor inferior representa as despesas estimadas a serem pagas até o final do mês')
    }
  }
  
  /**Função que mostra os dados do mês seguinte */

  function handleNextMonth() {
    let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
    EntriesDB.findByDate(parseInt(nextDtObj.dt)).then((res:any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(nextDtObj.dt)).then((res:any) => {
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

    EntriesDB.findByDate(parseInt(prevDtObj.dt)).then((res:any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(prevDtObj.dt)).then((res:any) => {
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
       await ValuesDB.findByDate(parseInt(data)).then((res:any) => {
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
        let obj: Balance = { month: month, year: year, amount: sumBalance }
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
      setPrimaryColor('#892E1A')
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
    Dates.findByDate(CurrentMonth,CurrentYear).then(() => {
      
    }).catch(err => {
      console.log(err)
      const DateObj = {
        month: CurrentMonth,
        year: CurrentYear,
      }
      Dates.create(DateObj)
      EntriesDB.updateReceived(false).then(res=>{
        console.log('Atualizado!'+res)
      }).catch(err=>{
        console.log(err)
      })
      console.log('Mes criado: '+CurrentMonth)
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
      EntriesDB.findByDate(parseInt(firstDate)).then((res:any) => {
        setEntries(res._array)
      }).catch(err => {
        console.log(err)
      })
      
      //Procura todos os valores correspondente a data atual ao abrir a aplicação
      ValuesDB.findByDate(parseInt(firstDate)).then((res:any) => {
        setValuesList(res._array)
        setNoBalance(false)
      }).catch(err => {
        console.log(err)
        setNoBalance(true)
      })
      
      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia
      EntriesDB.findByDateOrderByDay(parseInt(firstDate)).then((res:any) => {
        setNextEntries(res._array)
      }).catch(err => {
        console.log(err)
      })

      let nMonth = Functions.nextMonth(CurrentMonth,CurrentYear)
      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia do Mês seguinte
      EntriesDB.findByDateOrderByDay(parseInt(nMonth.dt)).then((res:any) => {
        setNextEntries2(res._array)
      }).catch(err => {
        console.log(err)
      })

      ValuesDB.allOrderByDate().then((res:any) => {
        let dtStart = res._array[0].dtStart
        if (dtStart != undefined){
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
          } while (ano < CurrentYear+20)
          loadBalance()
        }
      })
      datas = []

    });
    return reload;
  }, [])

  return (
    <LinearGradient colors={[primaryColor, secondColor]} style={styles.container}>
      <StatusBar style="light" translucent />

      {/*Mês e ano*/}
      <View style={styles.monthView}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Feather name="chevron-left" size={30} color={monthColor} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: monthColor }]}>
          {Functions.convertDtToStringMonth(selectedMonth)}  {selectedYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Feather name="chevron-right" size={30} color={monthColor} />
        </TouchableOpacity>
      </View>

      {valuesList.map(value => {
        if (selectedMonth == CurrentMonth && selectedYear == CurrentYear){
          if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Ganhos') contEarnings.push(value.amount)
          if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Despesas') contExpenses.push(value.amount)
        }
        if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Despesas') contEstimatedExpenses.push(value.amount)
        if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Ganhos') contEstimatedEarnings.push(value.amount)
      })}


      {/*Saldos*/}
      <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity style={{marginRight:5}} onPress={() => showModalBalance(1)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
            <Text style={styles.currentBalanceText}>
              Seu Saldo Atual
            </Text>
          </View>
          {noBalance?
          <View style={{flexDirection:'row', justifyContent:'center'}}>
              <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
          </View>
          :
          <NumberFormat
            value={contEarnings.reduce((a: any, b: any) => a + b, 0) - contExpenses.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => 
            <Text style={styles.currentBalanceTextValue}> 
              {value} 
            </Text>}
          />
          }
          {balance.map((bal, index) => {
            if (bal.year == selectedYear && bal.month == selectedMonth) {
              return (
                <View key={index}>
                  <NumberFormat
                    value={bal.amount}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => 
                    <Text style={[styles.currentBalanceTextValue,{fontSize:14}]}> 
                      {value} 
                    </Text>}
                  />
                </View>
              )
            }
          })}
        </View>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <Text style={styles.estimatedBalanceText}>
              Saldo Estimado
            </Text>
            <TouchableOpacity style={{marginLeft:5}} onPress={() => showModalBalance(2)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            {noBalance ?
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
              </View>
            :
              <NumberFormat
                value={
                  contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0) - contEstimatedExpenses.reduce((a: any, b: any) => a + b, 0)
                }
                displayType={'text'}
                thousandSeparator={true}
                format={Functions.currencyFormatter}
                renderText={value => 
                  <Text style={styles.estimatedBalanceTextValue}> 
                    {value} 
                  </Text>}
              />
            }
          </View>
        </View>
      </View>

      {/*Ganhos e Despesas*/}

      <View style={styles.valuesView}>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity style={{marginRight:5}} onPress={() => showModalBalance(3)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
            <Text style={styles.earningsText}>
              Ganhos
            </Text>
          </View>
          {noBalance? 
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={styles.earningsTextValue}>R$ 0,00</Text>
          </View>
          :
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <NumberFormat
              value={contEarnings.reduce((a: any, b: any) => a + b, 0)}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
            />
          </View>
          }
          {noBalance?
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>R$ 0,00</Text>
          </View>
          :
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <NumberFormat
              value={contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0)}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value =>
                <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>
                  {value}
                </Text>
              }/>
          </View>
          }
        </View>

        
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <Text style={styles.expensesText}>
              Despesas
            </Text>
            <TouchableOpacity style={{marginLeft:5}} onPress={() => showModalBalance(4)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}} />
            </TouchableOpacity>
          </View>
          {noBalance?
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={styles.expensesTextValue}>R$ 0,00</Text>
          </View>
          :
          <NumberFormat
            value={contExpenses.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => <Text style={styles.expensesTextValue}> {value} </Text>}
          />
          }
          {noBalance?
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={[styles.expensesTextValue, { fontSize: 14 }]}>R$ 0,00</Text>
          </View>
          :
          <NumberFormat
            value={contEstimatedExpenses.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value =>
              <Text style={[styles.expensesTextValue, { fontSize: 14 }]}>
                {value}
              </Text>}
          />
          }
        </View>
      </View>

      {/*Container Principal*/}
      <View style={styles.mainContainer}>
        {/*Botões Ganhos*/}

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

        {/*Botões Despesas*/}

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

        <ScrollView style={{maxHeight:95,elevation:5}}>
          {nextEntries.map((ear,index) => {
            if (ear.day >= todayDate.getDate() && ear.day <= (todayDate.getDate()+10) && !ear.received){
              let color
              if (ear.type == 'Ganhos'){
                color = '#1A8289'
              }else{
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day+'  '+Functions.convertDtToStringMonth(todayDate.getMonth()+1)}
                  </Text>
                </View>
              )
            }
          })
          }
          {todayDate.getDate()+5 > 30 && nextEntries2.map((ear, index)=>{
            if (ear.day <= 5){
              let color
              if (ear.type == 'Ganhos'){
                color = '#1A8289'
              }else{
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day+'  '+Functions.convertDtToStringMonth(todayDate.getMonth()+2)}
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
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Text style={styles.monthText}>
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
  modalContainer: {
    flex: 1,
    backgroundColor: ' rgba(0, 0, 0, 0.39);',
    justifyContent: 'center'
  },
  modalContent: {
        backgroundColor: '#fff',
        height: '50%',
        padding: 30,
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