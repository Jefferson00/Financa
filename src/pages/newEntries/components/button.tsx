import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useStylesStates } from "../../../contexts/stylesStates"

export default function ButtonSubmit({ props }: { props: any }) {

    const {colorBorderAddButton , tittleTextColor} = useStylesStates()

    return (
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <LinearGradient
                colors={['#FFFFFF', colorBorderAddButton + '22']}
                start={{ x: -0.1, y: 0.1 }}
                style={[styles.addNewButton, { borderColor: colorBorderAddButton }]}>
                {props.idUpdate != null ?
                    <TouchableOpacity
                        style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                        onPress={props.handleUpdate}
                    >
                        <Text style={[styles.addNewButtonText, { color: tittleTextColor }]}>Atualizar</Text>
                    </TouchableOpacity>
                    : <TouchableOpacity
                        style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                        onPress={props.handleCreateNew}
                    >
                        <Text style={[styles.addNewButtonText, { color: tittleTextColor }]}>Adicionar</Text>
                    </TouchableOpacity>
                }
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
