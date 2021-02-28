import React from "react"
import { StyleSheet, Text, View } from 'react-native'

import { Feather } from '@expo/vector-icons'

export default function NoResultsView() {

    return (
        <View style={styles.container}>
            <Text style={[styles.noResultsText]}>
                Sem resultados!
            </Text>
            <Feather name="x-octagon" size={40} color={"#d2d2d2"} />
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