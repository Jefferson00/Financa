import React, { useContext } from "react"
import { StyleSheet, Text, View } from 'react-native'

import { Feather } from '@expo/vector-icons'
import { StylesContext } from "../../../contexts/stylesContext"

export default function NoResultsView() {

    const {entriePrimaryColor, entrieSecondaryColor} = useContext(StylesContext)

    return (
        <View style={styles.container}>
            <Text style={[styles.noResultsText, {color:entriePrimaryColor}]}>
                Sem resultados!
            </Text>
            <Feather name="x-octagon" size={40} color={entrieSecondaryColor} />
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