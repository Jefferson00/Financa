import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { AntDesign} from '@expo/vector-icons'
import NumberFormat from 'react-number-format';
import Functions from '../../functions'

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useResultsDB} from '../../contexts/resultsDBStates'

export default function BalanceValues({functions}:{functions:any}){

    const {selectedMonth, selectedYear, noBalance} = useSelectedMonthAndYear();
    const {balance,valuesList} = useResultsDB();

    let contEarnings: Array<number> = []
    let contEstimatedEarnings: Array<number> = []
    let contExpenses: Array<number> = []
    let contEstimatedExpenses: Array<number> = []

    valuesList.map((value:any) => {
        if (selectedMonth == functions.CurrentMonth && selectedYear == functions.CurrentYear) {
          if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Ganhos') contEarnings.push(value.amount)
          if (value.amount != null && value.amount != NaN && value.amount != 0 && value.received && value.type == 'Despesas') contExpenses.push(value.amount)
        }
        if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Despesas') contEstimatedExpenses.push(value.amount)
        if (value.amount != null && value.amount != NaN && value.amount != 0 && value.type == 'Ganhos') contEstimatedEarnings.push(value.amount)
    })
    
    return(
        <>
        <View style={styles.balanceView}>
        <View style={styles.currentBalanceView}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => functions.showModalBalance(1)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            <Text style={styles.currentBalanceText}>
              Seu Saldo Atual
            </Text>
          </View>
          {noBalance || selectedMonth != functions.CurrentMonth || selectedYear != functions.CurrentYear?
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                let remainingValues = bal.amount - (contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0) - contEstimatedExpenses.reduce((a: any, b: any) => a + b, 0))
                return (
                  <View key={index}>
                    <NumberFormat
                      value={remainingValues}
                      displayType={'text'}
                      thousandSeparator={true}
                      format={Functions.currencyFormatter}
                      renderText={value =>
                        <Text style={[styles.currentBalanceTextValue, { fontSize: 14 }]}>
                          {value}
                        </Text>}
                    />
                  </View>
                )
              }
            })}
        </View>
        <View style={styles.currentBalanceView}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.estimatedBalanceText}>
              Saldo Estimado
            </Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => functions.showModalBalance(2)}>
              <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          </View>

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
                        <Text style={[styles.estimatedBalanceTextValue, { fontSize: 14 }]}>
                          {value}
                        </Text>}
                    />
                  </View>
                )
              }
            })}
        </View>
      </View>

      <View style={styles.valuesView}>
      <View style={styles.currentBalanceView}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity style={{ marginRight: 5 }} onPress={() => functions.showModalBalance(3)}>
            <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
          </TouchableOpacity>
          <Text style={styles.earningsText}>
            Ganhos
          </Text>
        </View>
        {noBalance || selectedMonth != functions.CurrentMonth || selectedYear != functions.CurrentYear?
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.earningsTextValue}>R$ 0,00</Text>
          </View>
          :
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <NumberFormat
              value={contEarnings.reduce((a: any, b: any) => a + b, 0)}
              displayType={'text'}
              thousandSeparator={true}
              format={Functions.currencyFormatter}
              renderText={value => <Text style={styles.earningsTextValue}> {value} </Text>}
            />
          </View>
        }
        {noBalance ?
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={[styles.earningsTextValue, { fontSize: 14 }]}>R$ 0,00</Text>
          </View>
          :
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <NumberFormat
              value={contEstimatedEarnings.reduce((a: any, b: any) => a + b, 0)}
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
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.expensesText}>
            Despesas
          </Text>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => functions.showModalBalance(4)}>
            <AntDesign name="questioncircle" size={20} color="#136065" style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        </View>
        {noBalance || selectedMonth != functions.CurrentMonth || selectedYear != functions.CurrentYear?
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
        {noBalance ?
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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