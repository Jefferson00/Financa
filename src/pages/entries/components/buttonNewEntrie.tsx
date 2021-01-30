import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import { useStylesStates } from "../../../contexts/stylesStates"

export default function ButtonNewEntrie({ props }: { props: any }) {
  
    const {tittleTextColor, colorBorderFooter, colorBorderAddButton, TextAddButton} = useStylesStates()

    return (
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <LinearGradient
                colors={['#FFFFFF', colorBorderFooter]}
                start={{ x: -0.1, y: 0.1 }}
                style={[styles.addNewButton, { borderColor: colorBorderAddButton }]}>
                <TouchableOpacity
                    style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                    onPress={props.handleNavigateNovo}>
                    <Text style={[styles.addNewButtonText, { color: tittleTextColor }]}>
                        {TextAddButton}
                    </Text>
                    <Feather name="plus" size={40} color={tittleTextColor} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    addNewButton: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderColor: '#24DBBA',
        borderWidth: 1,
        height: 83,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 26,
        marginVertical: 25,
    },
    addNewButtonText: {
        color: '#1A8289',
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
})
