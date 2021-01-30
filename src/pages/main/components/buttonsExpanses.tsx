
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import { Feather, Foundation } from '@expo/vector-icons'


export default function ButtonsExpanses({props}:{props:any}) {


    return(
        <View style={styles.buttonsView}>
          <LinearGradient colors={['#FFFFFF', '#CC372822']} start={{ x: -0.1, y: 0.1 }} style={styles.expensesButton}>
            <TouchableOpacity style={styles.expensesButton} onPress={props.handleNavigateDespesas}>
              <Foundation name="dollar" size={50} color="#CC3728" style={{ marginRight: 15, marginBottom: 5 }} />
              <Text style={styles.expensesTextButton}>Despesas</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={['#F4786C', '#CC3728']} start={{ x: -0.1, y: 0.1 }} style={styles.plusButton}>
            <TouchableOpacity style={styles.plusButton} onPress={props.handleNavigateNovoDespesas}>
              <Feather name="plus" size={40} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
    )

}

const styles = StyleSheet.create({
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 38,
      },
      expensesButton: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderColor: '#CC3728',
        borderWidth: 1,
        height: 83,
        width: 207,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
      },
      expensesTextButton: {
        color: "#CC3728",
        fontFamily: 'Poppins_500Medium',
        fontSize: 24,
      },
      plusButton: {
        width: 91,
        height: 83,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      },
})