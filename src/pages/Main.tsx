import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';
import AsyncStorage from '@react-native-community/async-storage'


import Ganhos from '../services/ganhos'
import Valores from '../services/valores';
import Functions from '../functions/index'
import Restante from '../services/restante'


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
  }

  interface ValuesValues {
    descricao: string,
    valor: number,
    dtInicio: number,
    dtFim: number,
    ganhos_id: number,
    dia: number,
    tipo: string,
  }

  interface Saldo {
    mes: number,
    ano: number,
    valor: number,
  }

  const [selectedMonth, setSelectedMonth] = useState(10)
  const [selectedYear, setSelectedYear] = useState(2020)
  const [earnings, setEarnings] = useState<EarningsValues[]>([])
  const [valuesList, setValuesList] = useState<ValuesValues[]>([])
  const [saldo, setSaldo] = useState<Saldo[]>([])
  const [sobra, setSobra] = useState(0)
  const [balance, setBalance] = useState(0)
  const [restante, setRestante] = useState(0)
  const [somaSaldo, setSomaSaldo] = useState(0)
  let ArrCU : any = []
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



  function handleNextMonth() {
    //console.log(selectedMonth)
    let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
    Ganhos.findByDate(parseInt(nextDtObj.dt)).then(res => {
      setEarnings(res._array)
    }).catch(err => {
      setEarnings([])
      console.log(err)
    })

    Valores.findByDate(parseInt(nextDtObj.dt)).then(res => {
      // console.log(res)
      setValuesList(res._array)
      let somaGanhos = 0
      let somaDespesas = 0
      for (var i = 0; i < res._array.length; i++) {
        if (res._array[i].tipo == 'Ganhos') {
          somaGanhos = somaGanhos + res._array[i].valor
          //console.log('Soma Ganhos: ' + somaGanhos)
        } else if (res._array[i].tipo == 'Despesas') {
          somaDespesas = somaDespesas + res._array[i].valor
          //console.log('Soma Despesas: ' + somaDespesas)
        }
      }
      //console.log('Saldo: ' + (somaGanhos - somaDespesas))
      setBalance(somaGanhos - somaDespesas)
    }).catch(err => {
      setValuesList([])
      setBalance(0)
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
      //console.log(err)
    })

    Valores.findByDate(parseInt(prevDtObj.dt)).then(res => {
      //console.log(res)
      setValuesList(res._array)
      let somaGanhos = 0
      let somaDespesas = 0
      for (var i = 0; i < res._array.length; i++) {
        if (res._array[i].tipo == 'Ganhos') {
          somaGanhos = somaGanhos + res._array[i].valor
          
        } else if (res._array[i].tipo == 'Despesas') {
          somaDespesas = somaDespesas + res._array[i].valor

        }
      }
    }).catch(err => {
      setValuesList([])
      //console.log(err)
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

  function selectLastMonth(month: number, year: number) {
    let lastMonth = month - 1
    let lastYear = year
    if (lastMonth == 0) {
      lastMonth = 12
      lastYear = year - 1
    }

    return { lastMonth: lastMonth, lastYear: lastYear }
  }

  useEffect(() => {

    setSelectedMonth(CurrentMonth)
    setSelectedYear(CurrentYear)

    
    const unsubscribe = navigation.addListener('focus', () => {
      let firstDate
      //let lastDate
      //let lastBalance : number = 0
      //let last = selectLastMonth(CurrentMonth,CurrentYear)
      if (CurrentMonth < 10) {
        firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
      } else {
        firstDate = CurrentYear.toString() + CurrentMonth.toString()
      }

      /*if (last.lastMonth < 10){
          lastDate = last.lastMonth.toString()+ '0' + last.lastYear.toString()
      }else{
          lastDate = last.lastMonth.toString() + last.lastYear.toString()
      }
      console.log(lastDate)
      Valores.findByDate(parseInt(lastDate)).then(res=>{
        let somaGanhos = 0
          let somaDespesas = 0 
            for(var i=0; i < res._array.length; i++){
              if(res._array[i].tipo == 'Ganhos'){
                somaGanhos = somaGanhos + res._array[i].valor
                console.log('Soma Ganhos: '+somaGanhos)
              }else if(res._array[i].tipo == 'Despesas'){
                somaDespesas = somaDespesas + res._array[i].valor
                console.log('Soma Despesas: '+somaDespesas)
              }
            }
            lastBalance = somaGanhos - somaDespesas
      }).catch(err => {
        console.log(err)
      })*/

      Ganhos.findByDate(parseInt(firstDate)).then(res => {
        setEarnings(res._array)

      }).catch(err => {
        console.log(err)
      })
      Valores.findByDate(parseInt(firstDate)).then(res => {
        
        setValuesList(res._array)
        let somaGanhos = 0
        let somaDespesas = 0
        for (var i = 0; i < res._array.length; i++) {
          if (res._array[i].tipo == 'Ganhos') {
            somaGanhos = somaGanhos + res._array[i].valor
            //console.log('Soma Ganhos: '+somaGanhos)
          } else if (res._array[i].tipo == 'Despesas') {
            somaDespesas = somaDespesas + res._array[i].valor
            //console.log('Soma Despesas: '+somaDespesas)
          }
        }
        // console.log(lastBalance)
        // setBalance(lastBalance + (somaGanhos - somaDespesas))

      }).catch(err => {
        console.log(err)
      })


      Valores.allOrderByDate().then(res => {
        
        let dtInicio = res._array[0].dtInicio
        let ano: number = parseInt(Functions.toMonthAndYear(dtInicio).year)
        let mes: number = parseInt(Functions.toMonthAndYear(dtInicio).month)
        let dateP
        let somaSal = 0
        let objSal : any
        
    
        //console.log(Functions.toMonthAndYear(dtInicio).year)
        do {
          for (var i = mes; i <= 13; i++) {
            if (i == 13) {
              mes = 1
              ano = ano + 1
            } else {
              //console.log("Mês: " + i + " Ano: " + ano)
              if (i < 10) {
                dateP = ano.toString() + '0' + i.toString()
              } else {
                dateP = ano.toString() + i.toString()
              }
              //console.log(dateP)
              datas.push(dateP)
 
            }
            
          }
        } while (ano < 2022)
        test().then(()=>{
          loadBalance()
        })
      })
      calcSobra()
      datas = []

    });
    return unsubscribe;



  }, [])

  async function test(){
    await new Promise((resolve,reject)=>{
      resolve(setSaldo([]))
    })
  }

  async function loadBalance(){
    let somaSald = 0
    let arraypvfrfunciona :any = []
    setSaldo([])

      for (const [index, data] of datas.entries()){
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
                let obj : Saldo=  {mes: month, ano : year, valor: somaSald}
                //console.log(obj)
                if (arraypvfrfunciona.indexOf(obj) > -1){

                }else{
                  arraypvfrfunciona.push(obj)
                }
        }).catch(err => {
          console.log(err)
        })
      }
        setSaldo(arraypvfrfunciona)

      arraypvfrfunciona = []
  }

  function containObject(obj:any, array:any){
    for(var i=0; i< array.length; i++){
      console.log('Saldo: '+array[i])
      console.log('Objeto: '+obj)
        if(array[i] === obj){
          return true
        }
        else{
          return false
        }
    }
  }

  useEffect(()=>{
    //console.log(saldo)
  },[saldo])

  let contGanhos: any = []
  let contGanhosEstimadas: any = []
  let contDespesas: any = []
  let contDespesasEstimadas: any = []

  function calcSobra() {
    let ganhos = 0
    let despesas = 0
    valuesList.map(value => {
      if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Ganhos') ganhos = ganhos + value.valor
      if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Despesas') despesas = despesas + value.valor

      //console.log(ganhos-despesas)
      setSobra((ganhos - despesas) + restante)
    })

  }

  useEffect(() => {
    calcSobra()
    //console.log(sobra)
  }, [valuesList])

  //calcSobra()
  //console.log(saldo)
  return (
    <LinearGradient colors={[primaryColor, secondColor]} style={styles.container}>
      <StatusBar style="light" translucent />

      {/*Mês e ano*/}
      <View style={styles.monthView}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Feather name="arrow-left" size={30} color={monthColor} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: monthColor }]}>
          {Functions.convertDtToStringMonth(selectedMonth)} / {selectedYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Feather name="arrow-right" size={30} color={monthColor} />
        </TouchableOpacity>
      </View>

      {valuesList.map(value => {
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.dia <= todayDate.getDate() && value.tipo == 'Ganhos') contGanhos.push(value.valor)
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.dia <= todayDate.getDate() && value.tipo == 'Despesas') contDespesas.push(value.valor)
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Despesas') contDespesasEstimadas.push(value.valor)
        if (value.valor != null && value.valor != NaN && value.valor != 0 && value.tipo == 'Ganhos') contGanhosEstimadas.push(value.valor)
      })}


      {/*Saldos*/}
      <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <Text style={styles.currentBalanceText}>
            Seu Saldo Atual
            </Text>
          {saldo.map((sal,index) => {
              //console.log(sal)
              //console.log(sal.mes)
              
                
                  if(sal.ano == selectedYear && sal.mes == selectedMonth){
                    return (
                      <View key={index}> 
                          <NumberFormat
                          value={
                            sal.valor
                          }
                          displayType={'text'}
                          thousandSeparator={true}
                          format={Functions.currencyFormatter}
                          renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
                        />
                      </View>
                    )
                  }
               
              
          })}

        </View>
        <View style={styles.currentBalanceView}>
          <Text style={styles.estimatedBalanceText}>
            Saldo Estimado
            </Text>
          <NumberFormat
            value={
              contGanhosEstimadas.reduce((a: any, b: any) => a + b, 0) - contDespesasEstimadas.reduce((a: any, b: any) => a + b, 0)
            }
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
          />
        </View>
      </View>

      {/*Ganhos e Despesas*/}

      <View style={styles.valuesView}>
        <View style={styles.currentBalanceView}>
          <Text style={styles.earningsText}>
            Ganhos
            </Text>
          <NumberFormat
            value={contGanhos.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
          />
        </View>
        <View style={styles.currentBalanceView}>
          <Text style={styles.expensesText}>
            Despesas
            </Text>
          <NumberFormat
            value={contDespesas.reduce((a: any, b: any) => a + b, 0)}
            displayType={'text'}
            thousandSeparator={true}
            format={Functions.currencyFormatter}
            renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
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