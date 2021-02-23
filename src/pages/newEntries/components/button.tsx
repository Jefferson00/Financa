import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useStylesStates } from "../../../contexts/stylesStates"

export default function ButtonSubmit({ props }: { props: any }) {

    const {backgroundColorButton, colorBorderAddButton , tittleTextColor} = useStylesStates()

    return (
        <View>
                {props.idUpdate != null ?
                    <TouchableOpacity
                        style={[styles.addNewButton, {borderColor: colorBorderAddButton , backgroundColor: backgroundColorButton}]}
                        onPress={props.handleUpdate}
                    >
                        <Text style={styles.addNewButtonText}>Atualizar</Text>
                    </TouchableOpacity>
                    : <TouchableOpacity
                        style={[styles.addNewButton, { borderColor: colorBorderAddButton, backgroundColor: backgroundColorButton }]}
                        onPress={props.handleCreateNew}
                    >
                        <Text style={styles.addNewButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                }
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
