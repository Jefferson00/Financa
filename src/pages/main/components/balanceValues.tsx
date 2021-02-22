import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import  {Ionicons } from '@expo/vector-icons'
import NumberFormat from 'react-number-format';
import Functions from '../../../functions'

import { ValuesValues, Balance } from "../../../interfaces"

import { useSelectedMonthAndYear } from '../../../contexts/selectMonthAndYear'
import { useResultsDB } from '../../../contexts/resultsDBStates'

import ButtonsEarnings from "./buttonsEarnings"
import ButtonsExpanses from "./buttonsExpanses"

export default function BalanceValues({ props }: { props: any }) {

  const { selectedMonth, selectedYear, noBalance } = useSelectedMonthAndYear();
  const { balance, valuesList } = useResultsDB();

  const [done, setDone] = useState(false)

  const [isBalanceActive, setIsBalanceActive] = useState(true)
  const [isEarningsActive, setIsEarningsActive] = useState(false)
  const [isExpansesActive, setIsExpansesActive] = useState(false)

  const [seeBalanceValues, setSeeBalanceValues] = useState(true)
  const [seeEarningsValues, setSeeEarningsValues] = useState(true)
  const [seeExpansesValues, setSeeExpansesValues] = useState(true)

  let contEarnings: Array<number> = []
  let contEstimatedEarnings: Array<number> = []
  let contExpenses: Array<number> = []
  let contEstimatedExpenses: Array<number> = []

  valuesList.map((value: ValuesValues) => {
    if (selectedMonth == props.CurrentMonth && selectedYear == props.CurrentYear) {
      if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Ganhos') contEarnings.push(value.amount)
      if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Despesas') contExpenses.push(value.amount)
    }
    if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Despesas') contEstimatedExpenses.push(value.amount)
    if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Ganhos') contEstimatedEarnings.push(value.amount)
  })

  let currentBalance = contEarnings.reduce((a: any, b: any) => a + b, 0) - contExpenses.reduce((a: any, b: any) => a + b, 0)
  let currentEarnings = contEarnings.reduce((a: any, b: any) => a + b, 0)
  let currentExpenses = contExpenses.reduce((a: any, b: any) => a + b, 0)
  let estimatedExpenses = contEstimatedExpenses.reduce((a: any, b: any) => a + b, 0)
  let estimatedEarnings = contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0)

  let remainingValues
  let totalEstimatedBalance

  balance.map((bal: Balance, index: number) => {
    if (bal.year == selectedYear && bal.month == selectedMonth) {
      remainingValues = bal.amount - (contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0) - contEstimatedExpenses.reduce((a: any, b: any) => a + b, 0))
    }
  })

  balance.map((bal: Balance, index: number) => {
    if (bal.year == selectedYear && bal.month == selectedMonth) {
      totalEstimatedBalance = bal.amount
    }
  })

  function updateSeeValue(item:String){
      if (item == "Saldo"){
        setSeeBalanceValues(!seeBalanceValues)
      }
      else if( item == "Ganhos"){
        setSeeEarningsValues(!seeEarningsValues)
      }
      else if (item == "Despesas"){
        setSeeExpansesValues(!seeExpansesValues)
      }
  }

  return (
    <>
      <View style={styles.selectValuesView}>
        <TouchableOpacity style={isBalanceActive ? styles.activeButton : styles.nonActiveButton}
          onPress={() => {
            setIsBalanceActive(true)
            setIsEarningsActive(false)
            setIsExpansesActive(false)
          }}
        >
          <Text style={isBalanceActive ? styles.activeText : styles.nonActiveText}>
            Saldo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={isEarningsActive ? styles.activeButton : styles.nonActiveButton}
          onPress={() => {
            setIsBalanceActive(false)
            setIsEarningsActive(true)
            setIsExpansesActive(false)
          }}
        >
          <Text style={isEarningsActive ? styles.activeText : styles.nonActiveText}>
            Ganhos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={isExpansesActive ? styles.activeButton : styles.nonActiveButton}
          onPress={() => {
            setIsBalanceActive(false)
            setIsEarningsActive(false)
            setIsExpansesActive(true)
          }}
        >
          <Text style={isExpansesActive ? styles.activeText : styles.nonActiveText}>
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      {/*SALDOS*/}
      {isBalanceActive ?
        <>
          <View style={styles.balanceTitleView}>
            <Text style={styles.currentBalanceText}>
              Seu Saldo do mês
              </Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> updateSeeValue('Saldo')}>
                {seeBalanceValues?
                <Ionicons name="eye-off" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                :
                <Ionicons name="eye" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                }
            </TouchableOpacity>
          </View>
          <View style={styles.balanceView}>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.currentBalanceText}>
                  Atual
              </Text>
              </View>
              {/* Valor do Saldo Atual */}
              {/* Se não tiver saldo ou o mês selecionado for diferente do mês atual..., mostra o valor R$ 0,00 */}
              {
                seeBalanceValues?
                noBalance || currentBalance == 0 ?
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
                </View>
                :
                <NumberFormat
                  value={currentBalance}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value =>
                    <Text style={styles.currentBalanceTextValue}>
                       {value}
                    </Text> 
                  }
                />
                :
                <View style={styles.censoredValue}/>
              }

            </View>

            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.estimatedBalanceText}>
                  Estimado
              </Text>
              </View>

              {/* Valor do Saldo Estimado */}
              {seeBalanceValues?
                  noBalance ?
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                :
                <View style={styles.censoredValue}/>
              }

            </View>
          </View>
          <View style={styles.balanceTitleView}>
            <Text style={styles.currentBalanceText}>
              Seu Saldo Total
              </Text>
          </View>

          <View style={styles.balanceView}>

            {/* Valor restante dos meses anteriores */}
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.currentBalanceText}>
                  Atual
                </Text>
              </View>

              {seeBalanceValues?
                  <NumberFormat
                  value={remainingValues}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value =>
                    <Text style={[styles.currentBalanceTextValue]}>
                      {value}
                    </Text>
                    }
                  />
                  :
                  <View style={styles.censoredValue}/>
              }
            </View>

            {/* Valor do Saldo Estimado Total com os valores restantes  */}
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.estimatedBalanceText}>
                  Estimado
                </Text>
              </View>

              {seeBalanceValues?
                  <NumberFormat
                  value={totalEstimatedBalance}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value =>
                    <Text style={styles.estimatedBalanceTextValue}>
                      {value}
                    </Text>}
                  />
                  :
                  <View style={styles.censoredValue}/>
              }
            </View>
          </View>

        </>
        : null
      }




      {isEarningsActive ?
        <>
          <View style={styles.balanceTitleView}>
            <Text style={styles.currentBalanceText}>
              Seus ganhos do Mês
              </Text>
              <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> updateSeeValue('Ganhos')}>
                {seeEarningsValues?
                <Ionicons name="eye-off" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                :
                <Ionicons name="eye" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                }
              </TouchableOpacity>
          </View>
          <View style={styles.balanceView}>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.earningsText}>
                  Recebido
                  </Text>
              </View>
              {seeEarningsValues?
                  (selectedMonth < props.CurrentMonth && selectedYear <= props.CurrentYear) || selectedYear < props.CurrentYear ?
                  <NumberFormat
                    value={estimatedEarnings}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
                  />
                  : noBalance || currentEarnings == 0
                    ?
                    <Text style={styles.earningsTextValue}>R$ 0,00</Text>
                    :
                    <NumberFormat
                      value={currentEarnings}
                      displayType={'text'}
                      thousandSeparator={true}
                      format={Functions.currencyFormatter}
                      renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
                    />
                  :
                  <View style={styles.censoredValue}/>
              }
            </View>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={[styles.earningsText, { color: 'rgba(26, 130, 137, 0.6)' }]}>
                  Estimado
                </Text>
              </View>
              {
              seeEarningsValues?
              noBalance ?
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.earningsTextValue}>R$ 0,00</Text>
                </View>
                :
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  
                       <NumberFormat
                       value={estimatedEarnings}
                       displayType={'text'}
                       thousandSeparator={true}
                       format={Functions.currencyFormatter}
                       renderText={value =>
                         <Text style={[styles.earningsTextValue, { color: 'rgba(26, 130, 137, 0.6)' }]}>
                           {value}
                         </Text>
                       } />
                  
                </View>
                :
                <View style={styles.censoredValue}/>
              }
            </View>
          </View>
          <ButtonsEarnings></ButtonsEarnings>
        </>
        : null
      }

      {isExpansesActive ?
        <>
          <View style={styles.balanceTitleView}>
            <Text style={styles.currentBalanceText}>
              Suas despesas do mês
              </Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> updateSeeValue('Despesas')}>
                {seeExpansesValues?
                <Ionicons name="eye-off" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                :
                <Ionicons name="eye" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                }
            </TouchableOpacity>
          </View>
          <View style={styles.balanceView}>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={styles.expensesText}>
                  Pago
                  </Text>
              </View>
              { 
                seeExpansesValues?
                (selectedMonth < props.CurrentMonth && selectedYear <= props.CurrentYear) || selectedYear < props.CurrentYear ?
                <NumberFormat
                  value={estimatedExpenses}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value => <Text style={styles.expensesTextValue}> {value} </Text>}
                />
                : noBalance || currentExpenses == 0 ?
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.expensesTextValue}>R$ 0,00</Text>
                  </View>
                  :
                  <NumberFormat
                    value={currentExpenses}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => <Text style={styles.expensesTextValue}> {value} </Text>}
                  />
                :
                <View style={styles.censoredValue}/>
              }

            </View>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={[styles.expensesText, { color: 'rgba(204, 55, 40, 0.6)' }]}>
                  Estimado
                </Text>
              </View>
              {
                seeExpansesValues?
                noBalance ?
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.expensesTextValue}>R$ 0,00</Text>
                </View>
                :
                <NumberFormat
                  value={estimatedExpenses}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value =>
                    <Text style={[styles.expensesTextValue,{color:'rgba(204, 55, 40, 0.6)'}]}>
                      {value}
                    </Text>}
                />
                :
                <View style={styles.censoredValue}/>
              }
            </View>

          </View>
          <ButtonsExpanses></ButtonsExpanses>
        </>
        : null
      }
    </>
  )
}

const styles = StyleSheet.create({
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

  censoredValue:{
      height:25,
      width:136,
      backgroundColor:'rgba(247, 241, 241, 0.80)',
  },

  balanceTitleView: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 33, marginTop: 14, alignItems: 'center'
  },
  activeText:{
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color:'#1A8289'
  },
  nonActiveText:{
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color:'rgba(26, 130, 137, 0.6)'
  },
  selectValuesView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 26,
    marginTop: 13,
  },
  activeButton: {
    height: 30,
    marginHorizontal: 15,
    minWidth:120,
    borderRadius: 20,
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nonActiveButton: {
    height: 30,
    marginHorizontal: 15,
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  earningsText: {
    color: '#1A8289',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  earningsTextValue: {
    color: '#1A8289',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },

  expensesText: {
    color: '#CC3728',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  },

  expensesTextValue: {
    color: '#CC3728',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },
})