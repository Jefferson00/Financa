import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import  {Ionicons } from '@expo/vector-icons'

export default function BalanceView() {
    const [seeBalanceValues, setSeeBalanceValues] = useState(true)

    return(
        <>
          <View style={styles.balanceTitleView}>
                <Text style={styles.currentBalanceText}>
                    Seu Saldo do mês
                </Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> setSeeBalanceValues(!seeBalanceValues)}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
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