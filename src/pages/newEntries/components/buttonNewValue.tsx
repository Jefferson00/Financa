import React, {useState} from "react"
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity } from 'react-native'

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'

import { useStylesStates } from "../../../contexts/stylesStates"
import { useResultsDB } from "../../../contexts/resultsDBStates"
import { useSelectedMonthAndYear } from "../../../contexts/selectMonthAndYear"

import ValuesDB from '../../../services/valuesDB'


export default function ButtonNewValue({ props }: { props: any }) {

    
    const [contPlusButtonPressed, setContPlusButtonPressed] = useState(0)
    const [idValues, setIdValues] = useState(0)

    const {tittleTextColor, colorBorderAddButton } = useStylesStates()
    const {setValuesArray, valuesArray} = useResultsDB()
    const {selectedMonth, selectedYear} = useSelectedMonthAndYear()

    return (
        <View style={styles.newValuesView}>
            <Text style={[styles.newValuesText, { color: tittleTextColor }]}>
                Adcionar Novos Valores
            </Text>
            <TouchableOpacity style={[styles.plusButtonModal, { borderColor: colorBorderAddButton }]}
                onPress={() => {
                    props.setShowValues(true)
                    setContPlusButtonPressed(contPlusButtonPressed + 1)
                    if (contPlusButtonPressed > 0) {

                        setIdValues(idValues + 1)
                        setValuesArray([...valuesArray, { id: idValues, description: '', amount: '0', monthly: false, repeat: 1 }])
                    }
                    if ( props.idUpdate != null) {
                        props.selectedDate.setMonth(selectedMonth - 1)
                        props.selectedDate.setFullYear(selectedYear)
                        const newValueObj = {
                            description: '',
                            amount: '0',
                            dtStart: Functions.setDtStart( props.selectedDate),
                            dtEnd: Functions.setDtEnd(false, 0,  props.selectedDate),
                            entries_id:  props.idUpdate
                        }
                        ValuesDB.create(newValueObj)
                        props.updateValuesList()

                    }
                }}>
                <Feather name='plus' size={40} color={tittleTextColor} />
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