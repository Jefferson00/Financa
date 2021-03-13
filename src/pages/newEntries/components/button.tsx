import React, { useContext } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import { StylesContext } from "../../../contexts/stylesContext"


export default function ButtonSubmit() {

    const {handleCreateNewEntrie, handleUpdate ,entrieIdUpdate} = useContext(NewEntriesContext)
    const {entrieButtonBorder, entrieButtonBackground,resetValuesForm} = useContext(StylesContext)

    function handleCreateNew(){
        handleCreateNewEntrie()
        resetValuesForm()
    }

    function handleEntrieUpdate(){
        handleUpdate()
        resetValuesForm()
    }

    return (
        <View>
            {entrieIdUpdate == 0 ?
                <TouchableOpacity
                    style={[styles.addNewButton, { borderColor: entrieButtonBorder, backgroundColor: entrieButtonBackground }]}
                    onPress={handleCreateNew}
                >   
                    <Text style={styles.addNewButtonText}>Adicionar</Text>
                </TouchableOpacity>
            :
                <TouchableOpacity
                    style={[styles.addNewButton, { borderColor: entrieButtonBorder, backgroundColor: entrieButtonBackground }]}
                    onPress={handleEntrieUpdate}
                >   
                    <Text style={styles.addNewButtonText}>Atualizar</Text>
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
