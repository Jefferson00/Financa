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
            <TouchableOpacity style={{ marginLeft: 5 }}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
                </View>
                
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
                 
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                  </View>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                </View>
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