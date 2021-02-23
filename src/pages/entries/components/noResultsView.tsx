import React from "react"
import { StyleSheet, Text, View } from 'react-native'

import { Feather } from '@expo/vector-icons'
import { useStylesStates } from '../../../contexts/stylesStates'

export default function NoResultsView() {

    const { tittleTextColor } = useStylesStates()
    return (
        <View style={styles.container}>
            <Text style={[styles.noResultsText,{color:tittleTextColor}]}>
                Sem resultados!
            </Text>
            <Feather name="x-octagon" size={40} color={tittleTextColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    noResultsText:{
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    }
}) 