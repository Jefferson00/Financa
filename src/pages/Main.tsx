import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View ,ScrollView, Modal} from 'react-native';
import { Feather, AntDesign  } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';


import Ganhos from '../services/ganhos'
import Valores from '../services/valores'
import Dates from '../services/dates'
import Functions from '../functions/index'


export default function Main() {
  const navigation = useNavigation()

  interface EarningsValues {
    id: number,
    titulo: string,
    dia: number,
    dtInicio: number,
    dtFim: number,
    mensal: boolean,
    recebido: boolean,
    tipo:string,
  }

  interface ValuesValues {
    descricao: string,
    valor: number,
    dtInicio: number,
    dtFim: number,
    ganhos_id: number,
    dia: number,
    tipo: string,
    recebido: boolean,
  }

  interface Saldo {
    mes: number,
    ano: number,
    valor: number,
  }

  const [selectedMonth, setSelectedMonth] = useState(10)
  const [selectedYear, setSelectedYear] = useState(2020)
  const [earnings, setEarnings] = useState<EarningsValues[]>([])
  const [nextEarnings, setNextEarnings] = useState<EarningsValues[]>([])
  const [nextEarnings2, setNextEarnings2] = useState<EarningsValues[]>([])
  const [valuesList, setValuesList] = useState<ValuesValues[]>([])
  const [saldo, setSaldo] = useState<Saldo[]>([])
  const [modalBalance1, setModalBalance1] = useState(false)
  const [textModal, setTextModal] = useState('')

  
  let datas: any = []

  const [primaryColor, setPrimaryColor] = useState('#F9CF3C')
  const [secondColor, setSecondColor] = useState('#B26A15')
  const [monthColor, setMonthColor] = useState('#1A8289')

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

  function showModalBalance1(idModal: number){
    setModalBalance1(true)
    if (idModal == 1){
        setTextModal('Seu Saldo Atual representa o valor restante com base nos valores totais de ganhos e despesas recebidos e pagos no mês selecionado ')
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

  function handleNextMonth() {
    let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
    Ganhos.findByDate(parseInt(nextDtObj.dt)).then(res => {
      setEarnings(res._array)
    }).catch(err => {
      setEarnings([])
      console.log(err)
    })

    Valores.findByDate(parseInt(nextDtObj.dt)).then(res => {
      setValuesList(res._array)
    }).catch(err => {
      setValuesList([])
      console.log(err)
    })

    setSelectedMonth(nextDtObj.nextMonth)
    setSelectedYear(nextDtObj.nextYear)
  }

  function handlePrevMonth() {
    let prevDtObj = Functions.prevMonth(selectedMonth, selectedYear)

    Ganhos.findByDate(parseInt(prevDtObj.dt)).then(res => {
      setEarnings(res._array)
    }).catch(err => {
      setEarnings([])
      console.log(err)
    })

    Valores.findByDate(parseInt(prevDtObj.dt)).then(res => {
      setValuesList(res._array)
    }).catch(err => {
      setValuesList([])
      console.log(err)
    })

    setSelectedMonth(prevDtObj.prevMonth)
    setSelectedYear(prevDtObj.prevYear)
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

  const todayDate = new Date()
  const CurrentMonth = todayDate.getMonth() + 1
  const CurrentYear = todayDate.getFullYear()

  

  useEffect(() => {

    setSelectedMonth(CurrentMonth)
    setSelectedYear(CurrentYear)

    /*Verifica se houve mudança de mês, caso sim, atualiza todos os recebidos/pagos como falso*/ 
    Dates.findByDate(CurrentMonth,CurrentYear).then(res => {
      
    }).catch(err => {
      console.log(err)
      const DateObj = {
        month: CurrentMonth,
        year: CurrentYear,
      }
      Dates.create(DateObj)
      Ganhos.updateRecebidos(false).then(res=>{
        console.log('Atualizado!'+res)
      }).catch(err=>{
        console.log(err)
      })
      console.log('Mes criado: '+CurrentMonth)
    })


    const unsubscribe = navigation.addListener('focus', () => {
      let firstDate
      /*Converte para a data em String e no formato que é salvo no banco de dados*/
      if (CurrentMonth < 10) {
        firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
      } else {
        firstDate = CurrentYear.toString() + CurrentMonth.toString()
      }
      //Ex: firstDate: '202101'

      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação
      Ganhos.findByDate(parseInt(firstDate)).then(res => {
        setEarnings(res._array)
      }).catch(err => {
        console.log(err)
      })
      
      //Procura todos os valores correspondente a data atual ao abrir a aplicação
      Valores.findByDate(parseInt(firstDate)).then(res => {
        setValuesList(res._array)
      }).catch(err => {
        console.log(err)
      })
      
      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia
      Ganhos.findByDateOrderByDay(parseInt(firstDate)).then(res => {
        setNextEarnings(res._array)
      }).catch(err => {
        console.log(err)
      })

      let nMonth = Functions.nextMonth(CurrentMonth,CurrentYear)
      //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação ordenado pelo dia do Mês seguinte
      Ganhos.findByDateOrderByDay(parseInt(nMonth.dt)).then(res => {
        setNextEarnings2(res._array)
      }).catch(err => {
        console.log(err)
      })

      Valores.allOrderByDate().then(res => {
        let dtInicio = res._array[0].dtInicio
        if (dtInicio != undefined){
          let ano: number = parseInt(Functions.toMonthAndYear(dtInicio).year)
          let mes: number = parseInt(Functions.toMonthAndYear(dtInicio).month)
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
          } while (ano < 2022)
          loadBalance()
        }
      })
      datas = []

    });
    return unsubscribe;
  }, [])


  async function loadBalance() {
    let somaSald = 0
    let arraypvfrfunciona: any = []
    setSaldo([])

    for (const [index, data] of datas.entries()) {
      const todo = await Valores.findByDate(parseInt(data)).then(res => {
        let somaGanhos = 0
        let somaDespesas = 0
        for (var t = 0; t < res._array.length; t++) {
          if (res._array[t].tipo == 'Ganhos') {
            somaGanhos = somaGanhos + res._array[t].valor
            //console.log('Soma Ganhos: '+somaGanhos)
          } else if (res._array[t].tipo == 'Despesas') {
            somaDespesas = somaDespesas + res._array[t].valor
            //console.log('Soma Despesas: '+somaDespesas)
          }
        }
        let sal = somaGanhos - somaDespesas
        somaSald = somaSald + sal
        let year = parseInt(Functions.toMonthAndYear(data).year)
        let month = parseInt(Functions.toMonthAndYear(data).month)
        let obj: Saldo = { mes: month, ano: year, valor: somaSald }
        //console.log(obj)
        if (arraypvfrfunciona.indexOf(obj) > -1) {

        } else {
          arraypvfrfunciona.push(obj)
        }
      }).catch(err => {
        console.log(err)
      })
    }
    setSaldo(arraypvfrfunciona)

    arraypvfrfunciona = []
  }

  let contGanhos: any = []
  let contGanhosEstimadas: any = []
  let contDespesas: any = []
  let contDespesasEstimadas: any = []


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
          if (value.valor != null && value.valor != NaN && value.valor != 0 && value.recebido && value.tipo == 'Ganhos') contGanhos.push(value.valor)
          if (value.valor != null && value.valor != NaN && value.valor != 0 && value.recebido && value.tipo == 'Despesas') contDespesas.push(value.valor)
        }
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Despesas') contDespesasEstimadas.push(value.valor)
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Ganhos') contGanhosEstimadas.push(value.valor)
      })}


      {/*Saldos*/}
      <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity style={{marginRight:5}} onPress={() => showModalBalance1(1)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
            <Text style={styles.currentBalanceText}>
              Seu Saldo Atual
            </Text>
          </View>
          {saldo.map((sal, index) => {
            if (sal.ano == selectedYear && sal.mes == selectedMonth) {
              let saldoAtual = contGanhos.reduce((a: any, b: any) => a + b, 0) - contDespesas.reduce((a: any, b: any) => a + b, 0)
              return (
                <View key={index}>
                  <NumberFormat
                    value={saldoAtual}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => 
                    <Text style={styles.currentBalanceTextValue}> 
                      {value} 
                    </Text>}
                  />
                  <NumberFormat
                    value={sal.valor}
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
            <TouchableOpacity style={{marginLeft:5}} onPress={() => showModalBalance1(2)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <NumberFormat
              value={
                contGanhosEstimadas.reduce((a: any, b: any) => a + b, 0) - contDespesasEstimadas.reduce((a: any, b: any) => a + b, 0)
              }
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value => 
                <Text style={styles.estimatedBalanceTextValue}> 
                  {value} 
                </Text>}
            />
          </View>
        </View>
      </View>

      {/*Ganhos e Despesas*/}

      <View style={styles.valuesView}>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity style={{marginRight:5}} onPress={() => showModalBalance1(3)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}}/>
            </TouchableOpacity>
            <Text style={styles.earningsText}>
              Ganhos
            </Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <NumberFormat
              value={contGanhos.reduce((a: any, b: any) => a + b, 0)}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
            />
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <NumberFormat
              value={contGanhosEstimadas.reduce((a: any, b: any) => a + b, 0)}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value =>
                <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>
                  {value}
                </Text>
              }/>
            </View>
        </View>
        <View style={styles.currentBalanceView}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <Text style={styles.expensesText}>
              Despesas
            </Text>
            <TouchableOpacity style={{marginLeft:5}} onPress={() => showModalBalance1(4)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{opacity:0.5}} />
            </TouchableOpacity>
          </View>
          <NumberFormat
            value={contDespesas.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => <Text style={styles.expensesTextValue}> {value} </Text>}
          />
          <NumberFormat
            value={contDespesasEstimadas.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value =>
              <Text style={[styles.expensesTextValue, { fontSize: 14 }]}>
                {value}
              </Text>}
          />
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
          {nextEarnings.map((ear,index) => {
            if (ear.dia >= todayDate.getDate() && ear.dia <= (todayDate.getDate()+10)){
              let color
              if (ear.tipo == 'Ganhos'){
                color = '#1A8289'
              }else{
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.titulo}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.dia+'  '+Functions.convertDtToStringMonth(todayDate.getMonth()+1)}
                  </Text>
                </View>
              )
            }
          })
          }
          {todayDate.getDate()+5 > 30 && nextEarnings2.map((ear, index)=>{
            if (ear.dia <= 5){
              let color
              if (ear.tipo == 'Ganhos'){
                color = '#1A8289'
              }else{
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.titulo}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.dia+'  '+Functions.convertDtToStringMonth(todayDate.getMonth()+2)}
                  </Text>
                </View>
              )
            }
          })}
        </ScrollView>

      </View>

      <Modal animationType="slide" visible={modalBalance1} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Text style={styles.monthText}>
                    {textModal}
                </Text>
              <TouchableOpacity onPress={() => { setModalBalance1(!modalBalance1) }}>
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