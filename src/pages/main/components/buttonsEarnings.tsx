
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import { useNavigation } from '@react-navigation/native';

import { Feather, Foundation } from '@expo/vector-icons'


export default function ButtonsEarnings() {

    const navigation = useNavigation()

    function handleNavigateGanhos() {
      navigation.navigate('Entries', { item: 'Ganhos'})
    }
    function handleNavigateNovoGanhos() {
      navigation.navigate('NewEntries', { item: 'Ganhos'})
    }
    return(
        <View style={styles.buttonsView}>
            
                <TouchableOpacity style={styles.earningsButton} onPress={handleNavigateGanhos}>
                      <Foundation name="dollar" size={40} color="#ffffff" style={{ marginRight: 15}} />
                      <Text style={styles.earningsTextButton}>Ganhos</Text>
                </TouchableOpacity>
        
          
                <TouchableOpacity style={styles.plusButton} onPress={handleNavigateNovoGanhos}>
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
    
      earningsButton: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderColor: '#24DBBA',
        backgroundColor:'rgba(26, 130, 137, 0.5)',
        borderWidth: 1,
        height: 55,
        width: 247,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        paddingLeft:24,
      },
    
      earningsTextButton: {
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
        borderColor: '#24DBBA',
        backgroundColor:'rgba(26, 130, 137, 0.5)',
      },
})