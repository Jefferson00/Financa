import React from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'


import { useStylesStates } from "../../../contexts/stylesStates"
import { useResultsDB } from "../../../contexts/resultsDBStates"

import {ValuesItem} from "../../../interfaces"

export default function FormContentCreate({ props }: { props: any }) {

    const {tittleTextColor, subtittleTextColor } = useStylesStates()
    const {valuesArray} = useResultsDB()
    
    return(
        props.idUpdate == null && valuesArray.map((values:ValuesItem, index:number) => {
            if (props.showValues)
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
                                onChange={props.updateValues('description', index, false)}
                                value={values.description}
                                style={[styles.InputText, { width: 150 }]}
                                multiline={true}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:10}}>
                                <Text style={[styles.secondColorText, { color: subtittleTextColor, marginRight: 10, fontSize: 18 }]}>
                                    R$
                                </Text>
                                <TextInput
                                    keyboardType='numeric'
                                    placeholder='R$ 0,00'
                                    onChange={props.updateValues('amount', index, false)}
                                    value={values.amount.toString()}
                                    style={styles.InputTextValue}
                                    maxLength={10}
                                />
                            </View>
    
                        </View>
                        <View style={styles.valuesView}>
                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                Periodicidade
                            </Text>
                        </View>
                        <View style={styles.frequencyView}>
                            <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>Mensal</Text>
                            <Switch
                                trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                thumbColor={props.isEnabled ? 'd2d2d2' : tittleTextColor}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={props.updateValues('monthly', index, values.monthly)}
                                value={values.monthly}
                            />
    
                            <TextInput
                                onChange={props.updateValues('repeat', index, false)}
                                value={values.repeat.toString()}
                                style={styles.InputText}
                                keyboardType='numeric'
                                maxLength={2}
                            />
    
                            <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>Vezes</Text>
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
        width:'100%'
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
