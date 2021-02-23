import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import { useStylesStates } from "../../../contexts/stylesStates"

export default function ButtonNewEntrie({ props }: { props: any }) {
  
    const {backgroundColorButton, colorBorderAddButton, TextAddButton} = useStylesStates()

    return (
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <TouchableOpacity
                    style={[styles.addNewButton, {borderColor: colorBorderAddButton, backgroundColor: backgroundColorButton }]}
                    onPress={props.handleNavigateNovo}>
                    <Text style={styles.addNewButtonText}>
                        {TextAddButton}
                    </Text>
                    <Feather name="plus" size={40} color='#ffffff' style={{ marginLeft: 10 }} />
                </TouchableOpacity>
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
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
})
