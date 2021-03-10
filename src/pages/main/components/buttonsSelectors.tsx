import React, { useContext } from 'react'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {MainContext} from "../../../contexts/mainContext"

export default function ButtonsSelectors() {

    const {
      activeBalanceView,
      isBalanceActive,
      activeEarningsView,
      isEarningsActive,
      activeExpansesView,
      isExpansesActive
    } = useContext(MainContext);


    return(
        <View style={styles.selectValuesView}>
        <TouchableOpacity style={isBalanceActive ? styles.activeButton : styles.nonActiveButton}
          onPress={activeBalanceView}
        >
          <Text style={isBalanceActive ? styles.activeText : styles.nonActiveText}>
            Saldo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={isEarningsActive ? styles.activeButton : styles.nonActiveButton}
          onPress={activeEarningsView}
        >
          <Text style={isEarningsActive ? styles.activeText : styles.nonActiveText}>
            Ganhos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={isExpansesActive ? styles.activeButton : styles.nonActiveButton}
          onPress={activeExpansesView}
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
      color:'#3C93F9'
    },
    nonActiveText:{
      fontSize: 14,
      fontFamily: 'Poppins_500Medium',
      color:'rgba(60, 147, 249, 0.6)'
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