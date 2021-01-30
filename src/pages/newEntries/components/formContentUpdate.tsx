import React from "react"
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity } from 'react-native'

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'

import { useStylesStates } from "../../../contexts/stylesStates"
import { useResultsDB } from "../../../contexts/resultsDBStates"

import {ValuesItemUpdate} from "../../../interfaces"

export default function FormContentUpdate({ props }: { props: any }) {

    const {tittleTextColor, subtittleTextColor, colorBorderAddButton } = useStylesStates()
    const {frequencys, setFrequencys, valuesUpdate} = useResultsDB()
    
    return(
        props.idUpdate != null && valuesUpdate.map((values:ValuesItemUpdate, index:number) => {
            var monthly = false

            if (values.dtEnd == 209912) {
                monthly = true
            }
            return (
                <View style={styles.valuesViewItem} key={index}>
                    <View style={styles.valuesView}>
                        <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                            Descrição
                        </Text>
                        <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                            Valor
                        </Text>
                    </View>
                    <View style={styles.valuesView}>

                        <TextInput
                            onChange={ props.updateValuesUpdate('description', index, false)}
                            value={values.description}
                            style={[styles.InputText, { width: 150 }]} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.secondColorText, { color: subtittleTextColor, marginRight: 10, fontSize: 18 }]}>
                                R$
                            </Text>
                            <TextInput
                                keyboardType='numeric'
                                placeholder='R$ 0,00'
                                onChange={ props.updateValuesUpdate('amount', index, false)}
                                value={Functions.formatCurrency(values.amount)}
                                style={styles.InputTextValue} />
                        </View>

                    </View>
                    <View style={styles.frequencyView}>
                        <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>Mensal</Text>
                        <Switch
                            trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                            thumbColor={ props.isEnabled ? 'd2d2d2' : tittleTextColor}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={ props.updateValuesUpdate('monthly', index, [monthly, frequencys[index]])}
                            value={monthly}
                        />
                        <Feather name='chevron-left' size={30}
                            onPress={() => {
                                let newArr: any = frequencys.map((item:any, i:number) => {
                                    if (index == i) {
                                        return item - 1
                                    } else {
                                        return item
                                    }
                                })
                                setFrequencys(newArr)

                                props.updateFrequencyValuesUpdate('repeat', index, [monthly, frequencys[index] - 1])
                                
                            }}
                        />
                        {monthly ?
                            <Text>1</Text> :
                            <Text style={{ fontSize: 18 }}>{frequencys[index]}</Text>}
                        <Feather name='chevron-right' size={30}
                            onPress={() => {
                                let newArr: any = frequencys.map((item:any, i:number) => {
                                    if (index == i) {
                                        return item + 1
                                    } else {
                                        return item
                                    }
                                })
                                setFrequencys(newArr)
                                //console.log(frequencys[index])
                                props.updateFrequencyValuesUpdate('repeat', index, [monthly, frequencys[index] + 1])
                                //console.log('freq: ' + frequencys[index])
                            }}
                        />

                        <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>Vezes</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', margin: 10 }}>
                        <TouchableOpacity onPress={() =>  props.removeValue(values.id)}>
                            <Feather name="trash-2" size={20} color={colorBorderAddButton} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        })
    )
    
}

const styles = StyleSheet.create({
    valuesViewItem: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 15,
        paddingVertical: 5,
        paddingBottom: 10,
        justifyContent: 'center',
        marginBottom: 10,
        borderColor: '#eaeaea',
        borderWidth: 1,
    },
    tittleTextView: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formView: {
        marginHorizontal: 43
    },
    InputText: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#d2d2d2',
        color: '#136065',
    },
    InputTextValue: {
        height: 40,
        color: '#136065',
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        textAlign: 'center',
    },
    
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 19,
    },

    valuesView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
  
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginTop: 13,
    },

    secondColorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },

})
