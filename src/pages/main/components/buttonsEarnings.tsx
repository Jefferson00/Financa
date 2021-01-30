
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import { Feather, Foundation } from '@expo/vector-icons'


export default function ButtonsEarnings({props}:{props:any}) {


    return(
        <View style={styles.buttonsView}>
            <LinearGradient colors={['#FFFFFF', '#24DBBA22']} start={{ x: -0.1, y: 0.1 }} style={styles.earningsButton}>
                <TouchableOpacity style={styles.earningsButton} onPress={props.handleNavigateGanhos}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Foundation name="dollar" size={50} color="#1A8289" style={{ marginRight: 15, marginBottom: 5 }} />
                      <Text style={styles.earningsTextButton}>Ganhos</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
            <LinearGradient colors={['#24DBBA', '#2AC4A8']} start={{ x: -0.1, y: 0.1 }} style={styles.plusButton}>
                <TouchableOpacity style={styles.plusButton} onPress={props.handleNavigateNovoGanhos}>
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
    
      earningsButton: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderColor: '#24DBBA',
        borderWidth: 1,
        height: 83,
        width: 207,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
      },
    
      earningsTextButton: {
        color: "#1A8289",
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