import React, { useContext } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { StylesContext } from "../../../contexts/stylesContext"

export default function ButtonNewEntrie() {

    const {entrieButtonBackground, entrieButtonBorder} = useContext(StylesContext)

    return (
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <TouchableOpacity
                    style={[styles.addNewButton,{borderColor:entrieButtonBorder, backgroundColor:entrieButtonBackground}]}
                   >
                    <Text style={styles.addNewButtonText}>
                      Adicionar Novo
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
