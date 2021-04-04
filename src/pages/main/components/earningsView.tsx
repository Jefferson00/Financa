import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import ButtonsEarnings from "./buttonsEarnings"
import { MainContext } from '../../../contexts/mainContext';
import NumberFormat from 'react-number-format';
import Functions from '../../../utils'
import { StylesContext } from '../../../contexts/stylesContext';

interface EarningsValues{
  currentEarnings:number,
  estimatedEarnings:number
}

interface EarningProps{
    values: EarningsValues,
}


export default function EarningsView(props:EarningProps) {
  
  const {seeEarningsValues, selectedMonth, selectedYear, currentMonth, currentYear, handleSeeEarningsValues} = useContext(MainContext)
  const {colorScheme} = useContext(StylesContext)

  let colorText = ''
  if (colorScheme == 'dark'){
    colorText = '#24DBBA'
  }else{
    colorText = '#1A8289'
  }

  return (
    <>
      <View style={styles.balanceTitleView}>
          <Text style={styles.titleText}>Seus ganhos do Mês</Text>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleSeeEarningsValues}>
              {seeEarningsValues ?
                <Ionicons name="eye-off" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
                :
                <Ionicons name="eye" size={30} color="#ffffff" style={{ opacity: 0.5 }} />
              }
          </TouchableOpacity>
      </View>


      <View style={styles.balanceView}>
          <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Text style={[styles.earningsText, {color:colorText}]}>Recebido</Text>
              </View>
              {seeEarningsValues ?
                props.values.currentEarnings == 0 || selectedMonth != currentMonth || selectedYear != currentYear ?
                    <Text style={[styles.earningsTextValue, {color:colorText}]}>R$ 0,00</Text>
                :
                    <NumberFormat
                    value={props.values.currentEarnings}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => <Text style={[styles.earningsTextValue, {color:colorText}]}> {value} </Text>}
                    />
                :
                <View style={styles.censoredValue} />
              }
          </View>

          <View style={styles.currentBalanceView}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={[styles.earningsText, { color: 'rgba(26, 130, 137, 0.6)' }]}>Estimado</Text>
              </View>
              {
              seeEarningsValues ?
                  props.values.estimatedEarnings == 0 ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.earningsTextValue}>R$ 0,00</Text>
                    </View>
                  :
                     <NumberFormat
                      value={props.values.estimatedEarnings}
                      displayType={'text'}
                      thousandSeparator={true}
                      format={Functions.currencyFormatter}
                      renderText={value => 
                          <Text style={[styles.earningsTextValue, {color: 'rgba(26, 130, 137, 0.6)'}]}> 
                            {value} 
                          </Text>}
                      />
                  :
                  <View style={styles.censoredValue} />
              }
          </View>
      </View>
      
      <ButtonsEarnings />
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

  censoredValue: {
    height: 25,
    width: 136,
    backgroundColor: 'rgba(247, 241, 241, 0.80)',
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
  titleText:{
    fontFamily:'Poppins_600SemiBold',
    fontSize:14,
    color: '#fff',
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

})