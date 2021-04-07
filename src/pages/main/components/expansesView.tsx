import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import ButtonsExpanses from "./buttonsExpanses"
import { MainContext } from '../../../contexts/mainContext';
import NumberFormat from 'react-number-format';
import Functions from '../../../utils'
import { StylesContext } from '../../../contexts/stylesContext';

interface ExpansesValues{
  currentExpanses:number,
  estimatedExpanses:number
}

interface ExpansesProps{
    values: ExpansesValues,
}

export default function ExpansesView(props:ExpansesProps) {

  const {seeExpansesValues, selectedMonth, selectedYear, currentMonth, currentYear, handleSeeExpansesValues} = useContext(MainContext)
  const {colorScheme, isDarkTheme} = useContext(StylesContext)
  return (
    <>
        <View style={styles.balanceTitleView}>
            <Text style={styles.titleText}>Suas despesas do mês</Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleSeeExpansesValues}>
              {seeExpansesValues ?
                  <Ionicons name="eye-off" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                  :
                  <Ionicons name="eye" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
              }
            </TouchableOpacity>
        </View>


        <View style={styles.balanceView}>
            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Text style={styles.expensesText}>Pago</Text>
              </View>
              {
                seeExpansesValues ?
                  props.values.currentExpanses == 0 || selectedMonth != currentMonth || selectedYear != currentYear?
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.expensesTextValue}>R$ 0,00</Text>
                    </View>
                  :
                     <NumberFormat
                      value={props.values.currentExpanses}
                      displayType={'text'}
                      thousandSeparator={true}
                      format={Functions.currencyFormatter}
                      renderText={value => <Text style={styles.expensesTextValue}> {value} </Text>}
                    />
                  :
                  <View style={[styles.censoredValue, 
                    colorScheme == 'dark' || isDarkTheme ? 
                    {backgroundColor:'rgba(247, 241, 241, 0.40)'} : 
                    {backgroundColor:'rgba(247, 241, 241, 0.80)'}
                  ]}/>
              }
            </View>

            <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Text style={[styles.expensesText, { color: 'rgba(204, 55, 40, 0.6)' }]}>Estimado</Text>
              </View>
              {
                seeExpansesValues ?
                  props.values.estimatedExpanses == 0 ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.expensesTextValue}>R$ 0,00</Text>
                    </View>
                  :
                      <NumberFormat
                      value={props.values.estimatedExpanses}
                      displayType={'text'}
                      thousandSeparator={true}
                      format={Functions.currencyFormatter}
                      renderText={value => 
                          <Text style={[styles.expensesTextValue, {color: 'rgba(204, 55, 40, 0.6)'} ]}> 
                            {value} 
                          </Text>}
                    />
                  :
                  <View style={[styles.censoredValue, 
                    colorScheme == 'dark' || isDarkTheme ? 
                    {backgroundColor:'rgba(247, 241, 241, 0.40)'} : 
                    {backgroundColor:'rgba(247, 241, 241, 0.80)'}
                  ]}/>
              }
          </View>

        </View>
      <ButtonsExpanses />
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
  titleText:{
    fontFamily:'Poppins_600SemiBold',
    fontSize:14,
    color: '#fff',
  },

  censoredValue: {
    height:35,
    width:136,
    borderRadius:5,
    backgroundColor:'rgba(247, 241, 241, 0.80)',
  },

  balanceTitleView: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 33, marginTop: 14, alignItems: 'center'
  },

  currentBalanceText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
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