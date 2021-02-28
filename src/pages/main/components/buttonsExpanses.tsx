
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Feather, Foundation } from '@expo/vector-icons'


export default function ButtonsExpanses() {
    const navigation = useNavigation()
    function handleNavigateDespesas() {
      navigation.navigate('Entries', { item: 'Despesas'})
    }
    function handleNavigateNovoDespesas() {
      navigation.navigate('NewEntries', { item: 'Despesas'})
    }
    return(
        <View style={styles.buttonsView}>
            <TouchableOpacity style={styles.expensesButton} onPress={handleNavigateDespesas}>
              <Foundation name="dollar" size={40} color="#ffffff" style={{ marginRight: 15}} />
              <Text style={styles.expensesTextButton}>Despesas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusButton} onPress={handleNavigateNovoDespesas}>
              <Feather name="plus" size={40} color="#ffffff" />
            </TouchableOpacity>
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
        borderColor: '#FF4835',
        backgroundColor:'rgba(255, 72, 53, 0.5)',
        borderWidth: 1,
        height: 55,
        width: 247,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        paddingLeft:24,
      },
      expensesTextButton: {
        color: "#ffffff",
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
      },
      plusButton: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF4835',
        backgroundColor:'rgba(255, 72, 53, 0.5)',
      },
})