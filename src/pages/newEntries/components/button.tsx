import React, { useContext } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NewEntriesContext } from "../../../contexts/newEntriesContext"


export default function ButtonSubmit() {

    const {handleCreateNewEntrie} = useContext(NewEntriesContext)

    return (
        <View>
            <TouchableOpacity
                style={[styles.addNewButton, { borderColor: "#d2d2d2", backgroundColor: "#d2d2d2" }]}
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
