import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import  {Ionicons } from '@expo/vector-icons'
import { MainContext } from '../../../contexts/mainContext';
import { DataBDContext } from '../../../contexts/dataBDContext';
import NumberFormat from 'react-number-format';
import Functions from '../../../utils'

interface BalanceValues{
  currentBalance:number,
  estimatedBalance:number
}

interface BalanceProps{
   values: BalanceValues
}


export default function BalanceView(props:BalanceProps) {
   const {seeBalanceValues, handleSeeBalanceValues} = useContext(MainContext)
   

    return(
        <>
          <View style={styles.balanceTitleView}>
                <Text style={styles.currentBalanceText}>
                    Seu Saldo do mês
                </Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleSeeBalanceValues}>
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
                        <Text style={styles.currentBalanceText}>Atual</Text>
                  </View>

                  {seeBalanceValues?
                      props.values.currentBalance == 0 ?
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
                        </View>
                      :
                        <NumberFormat
                        value={props.values.currentBalance}
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
                      <Text style={styles.estimatedBalanceText}>Estimado</Text>
                  </View>
                  {seeBalanceValues?
                    props.values.estimatedBalance == 0 ?
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                      </View>
                    :
                    <NumberFormat
                        value={props.values.estimatedBalance}
                        displayType={'text'}
                        thousandSeparator={true}
                        format={Functions.currencyFormatter}
                        renderText={value =>
                          <Text style={styles.estimatedBalanceTextValue}>
                            {value}
                          </Text> 
                        }
                      />
                  :
                  <View style={styles.censoredValue}/>
                  }
              </View>
          </View>

          <View style={styles.balanceTitleView}>
              <Text style={styles.currentBalanceText}>Seu Saldo Total</Text>
          </View>

          <View style={styles.balanceView}>
              <View style={styles.currentBalanceView}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Text style={styles.currentBalanceText}>Atual</Text>
                  </View>
                {seeBalanceValues?
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                  </View>
                :
                  <View style={styles.censoredValue}/>
                }
              </View>

            
              <View style={styles.currentBalanceView}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Text style={styles.estimatedBalanceText}>Estimado</Text>
                  </View>
                  {seeBalanceValues?
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                      </View>
                  :
                      <View style={styles.censoredValue}/>
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
  
    censoredValue:{
        height:25,
        width:136,
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
  })