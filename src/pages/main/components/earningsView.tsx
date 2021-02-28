import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import ButtonsEarnings from "./buttonsEarnings"

export default function EarningsView() {
  const [seeEarningsValues, setSeeEarningsValues] = useState(true)
  return (
    <>
      <View style={styles.balanceTitleView}>
          <Text style={styles.currentBalanceText}>Seus ganhos do Mês</Text>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> setSeeEarningsValues(!seeEarningsValues)}>
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
                  <Text style={styles.earningsText}>Recebido</Text>
              </View>
              {seeEarningsValues ?
                <Text style={styles.earningsTextValue}>R$ 0,00</Text>
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
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Text style={styles.earningsTextValue}>R$ 0,00</Text>
                  </View>
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