import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import NumberFormat from 'react-number-format';
import Functions from '../../../functions'

import { ValuesValues, Balance } from "../../../interfaces"

import { useSelectedMonthAndYear } from '../../../contexts/selectMonthAndYear'
import { useResultsDB } from '../../../contexts/resultsDBStates'

import Loader from "../../entries/components/loader"

export default function BalanceValues({ props }: { props: any }) {

  const { selectedMonth, selectedYear, noBalance } = useSelectedMonthAndYear();
  const { balance, valuesList } = useResultsDB();

  const [done, setDone] = useState(false)

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

  return (
    <>
      <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => props.showModalBalance(1)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            <Text style={styles.currentBalanceText}>
              Seu Saldo Atual
            </Text>
          </View>
          {/* Valor do Saldo Atual */}
          {/* Se não tiver saldo ou o mês selecionado for diferente do mês atual..., mostra o valor R$ 0,00 */}
          {noBalance || currentBalance == 0 ?
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
                </Text>}
            />
          }

          {/* Valor restante dos meses anteriores */}
          
          <NumberFormat
              value={remainingValues}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value =>
              <Text style={[styles.currentBalanceTextValue, { fontSize: 14 }]}>
                {value}
              </Text>
              }
          /> 
        </View>

        <View style={styles.currentBalanceView}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.estimatedBalanceText}>
              Saldo Estimado
            </Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => props.showModalBalance(2)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          </View>

          {/* Valor do Saldo Estimado */}
          {noBalance ?
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
          }
          {/* Valor do Saldo Estimado Total com os valores restantes  */}
          {}
          <NumberFormat
              value={totalEstimatedBalance}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value =>
                <Text style={[styles.estimatedBalanceTextValue, { fontSize: 14 }]}>
                  {value}
                </Text>}
              />
        </View>
      </View>

      <View style={styles.valuesView}>
        {/* GANHOS*/}
        <View style={styles.currentBalanceView}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => props.showModalBalance(3)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            <Text style={styles.earningsText}>
              Ganhos
            </Text>
          </View>
          {/* Valor dos ganhos atuais */}
          {/* Se é um mês anterior ao mês atual, mostra o ganhos estimados daquele mês 
            do contrario, verifica se os ganhos atuais são iguais a zero, caso não for, mostra os ganhos atuais
          */}
          {(selectedMonth < props.CurrentMonth && selectedYear <= props.CurrentYear) || selectedYear < props.CurrentYear ?
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <NumberFormat
                value={estimatedEarnings}
                displayType={'text'}
                thousandSeparator={true}
                format={Functions.currencyFormatter}
                renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
              />
            </View>
            : noBalance || currentEarnings == 0
              ?
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.earningsTextValue}>R$ 0,00</Text>
              </View>
              :
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <NumberFormat
                  value={currentEarnings}
                  displayType={'text'}
                  thousandSeparator={true}
                  format={Functions.currencyFormatter}
                  renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
                />
              </View>
          }
          {/* Valor dos ganhos estimados */}
          {/* verifica se possui saldo, caso possua mostra os ganhos estimados
          */}

          {noBalance ?
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>R$ 0,00</Text>
            </View>
            :
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <NumberFormat
                value={estimatedEarnings}
                displayType={'text'}
                thousandSeparator={true}
                format={Functions.currencyFormatter}
                renderText={value =>
                  <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>
                    {value}
                  </Text>
                } />
            </View>
          }
        </View>


        <View style={styles.currentBalanceView}>
          {/* DESPESAS*/}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.expensesText}>
              Despesas
            </Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => props.showModalBalance(4)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          </View>
          {/* Valor das despesas atuais */}
          {/* Se é um mês anterior ao mês atual, mostra as despesas estimadas daquele mês 
            do contrario, verifica se as despesas atuais são iguais a zero, caso não for, mostra as despesas atuais
          */}
          {(selectedMonth < props.CurrentMonth && selectedYear <= props.CurrentYear) || selectedYear < props.CurrentYear ?
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
          }

           {/* Valor das despesas estimadas */}
          {/* verifica se possui saldo, caso possua mostra as despesas estimadas
          */}
          {noBalance ?
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={[styles.expensesTextValue, { fontSize: 14 }]}>R$ 0,00</Text>
            </View>
            :
            <NumberFormat
              value={estimatedExpenses}
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
})