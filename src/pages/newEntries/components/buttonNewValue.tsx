import React, {useContext, useState} from "react"
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity } from 'react-native'

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'


import ValuesDB from '../../../services/valuesDB'
import { StylesContext } from "../../../contexts/stylesContext"
import { NewEntriesContext } from "../../../contexts/newEntriesContext"

interface ValuesData{
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
}


export default function ButtonNewValue() {

    
    const [contPlusButtonPressed, setContPlusButtonPressed] = useState(0)
    const [idValues, setIdValues] = useState(0)

    const {entriePrimaryColor, entrieSecondaryColor, showValuesForm, isValuesFormVisible} = useContext(StylesContext)
    const {addNewValueBeforeCreate} = useContext(NewEntriesContext)

    const newValue: ValuesData = {
        description: '',
        amount: 0,
        dtStart: 0,
        dtEnd: 0,
        entries_id: 0,
    }

    return (
        <View style={styles.newValuesView}>
            {isValuesFormVisible ?
                <Text style={[styles.newValuesText, { color: entriePrimaryColor }]}>
                    Adcionar Novos Valores
                </Text>
            :
                <Text style={[styles.newValuesText, { color: entriePrimaryColor }]}>
                   Detalhes
                </Text>
            }
            <TouchableOpacity style={[styles.plusButtonModal, { borderColor: entrieSecondaryColor }]}
                onPress={() => {
                    showValuesForm()
                    setContPlusButtonPressed(contPlusButtonPressed + 1)
                    if (contPlusButtonPressed > 0){
                        
                        addNewValueBeforeCreate(newValue)
                    }
                }}>
                {isValuesFormVisible ?
                    <Feather name='plus' size={40} color={entriePrimaryColor} />
                    :
                    <Feather name='chevron-up' size={40} color={entriePrimaryColor} />
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    newValuesView: {
        alignItems: "center",
        paddingVertical: 26,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    newValuesText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
    plusButtonModal: {
        borderRadius: 10,
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#1A8289',
        justifyContent: 'center',
        alignItems: 'center'
    },

})