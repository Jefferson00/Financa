import { useNavigation } from "@react-navigation/core"
import React, { useContext } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import { StylesContext } from "../../../contexts/stylesContext"


export default function ButtonSubmit() {
    const navigation = useNavigation()

    const {handleCreateNewEntrie, handleUpdate ,entrieIdUpdate, titleInputEntrie, entrieValuesBeforeCreate, typeOfEntrie} = useContext(NewEntriesContext)
    const {entrieButtonBorder, entrieButtonBackground,resetValuesForm} = useContext(StylesContext)

    function verifyInputs(){
        if (titleInputEntrie == ''){
            console.log('titulo vazio')
            return false
        }
        let emptyEntries = entrieValuesBeforeCreate.filter(entrie => entrie.amount == 0 )
        console.log(emptyEntries.length)
        if (emptyEntries.length > 0){
            console.log('valor vazio')
            return false
            
        }
        return true
    }

    function handleCreateNew(){
        if (verifyInputs()){
            handleCreateNewEntrie()
            resetValuesForm()
            navigation.navigate('Entries', { item: typeOfEntrie})
        }else{
            alert('Preencha todos os campos!')
        }
    }

    function handleEntrieUpdate(){
        if (verifyInputs()){
            handleUpdate()
            resetValuesForm()
            navigation.navigate('Entries', { item: typeOfEntrie})
        }else{
            alert('Preencha todos os campos!')
        }
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
