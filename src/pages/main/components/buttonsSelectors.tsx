import React, { useState } from 'react'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ButtonsSelectors() {

    
  const [isBalanceActive, setIsBalanceActive] = useState(true)
  const [isEarningsActive, setIsEarningsActive] = useState(false)
  const [isExpansesActive, setIsExpansesActive] = useState(false)


    return(
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
    )
}

const styles = StyleSheet.create({
   
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
  })