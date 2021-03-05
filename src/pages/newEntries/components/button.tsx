import React, { useContext } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import { StylesContext } from "../../../contexts/stylesContext"


export default function ButtonSubmit() {

    const {handleCreateNewEntrie} = useContext(NewEntriesContext)
    const {entrieButtonBorder, entrieButtonBackground} = useContext(StylesContext)

    return (
        <View>
            <TouchableOpacity
                style={[styles.addNewButton, { borderColor: entrieButtonBorder, backgroundColor: entrieButtonBackground }]}
                onPress={handleCreateNewEntrie}
            >   
                <Text style={styles.addNewButtonText}>Adicionar</Text>
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
