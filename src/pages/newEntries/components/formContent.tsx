import React from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'

import { useStylesStates } from "../../../contexts/stylesStates"
import { useResultsDB } from "../../../contexts/resultsDBStates"


export default function FormContent({ props }: { props: any }) {
    const { tittleTextColor, subtittleTextColor, valueTitle, onChangeTitle, receivedTextDate, receivedText } = useStylesStates()
    const { frequencys, setFrequencys, valueFrequency, setValueFrequency, valuesArray } = useResultsDB()
    console.log("COLOR: "+tittleTextColor)
    return (
        <>
            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                Título
            </Text>
            <TextInput 
                onChangeText={text => onChangeTitle(text)} 
                value={valueTitle} 
                style={styles.InputText} 
                maxLength={45}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                        {receivedTextDate}
                    </Text>
                    <View style={styles.dateView}>
                        <Text style={[styles.subTittleText, { color: subtittleTextColor }]} onPress={props.showDatepicker}>
                            {props.date.getDate()} / {Functions.convertDtToStringMonth(props.date.getMonth() + 1)}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                        {receivedText}
                    </Text>
                    <Switch
                        trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                        thumbColor={props.isEnabledReceived ? 'd2d2d2' : tittleTextColor}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={props.toggleSwitchReceived}
                        value={props.isEnabledReceived}
                    />
                </View>
            </View>

            {props.show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date}
                    is24Hour={true}
                    display="default"
                    onChange={props.onChangeDate}
                />
            )}
            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                Periodicidade
            </Text>
            <View style={styles.frequencyView}>
                <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>
                    Mensal
                </Text>
                <Switch
                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                    thumbColor={props.switchMonthlyisEnabled ? 'd2d2d2' : tittleTextColor}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={props.toggleSwitchMonthly}
                    value={props.switchMonthlyisEnabled}
                />
                {props.switchMonthlyisEnabled ?
                    <>
                        <Feather name='chevron-left' size={30} />
                        <Text style={{ fontSize: 18 }}>-</Text>
                        <Feather name='chevron-right' size={30} />
                    </>
                    :
                    <>
                        <Feather name='chevron-left' size={30}
                            onPress={() => {
                                if (valueFrequency > 1) {
                                    setValueFrequency(valueFrequency - 1)
                                    props.updateOneValue('repeat', 0, (valueFrequency - 1))
                                    let newArr: any = frequencys.map((item: any, i: number) => {
                                        if (i == 0 && item == valueFrequency) {
                                            return item - 1
                                        } else {
                                            return item
                                        }
                                    })
                                    setFrequencys(newArr)
                                }
                            }}
                        />
                        <Text style={{ fontSize: 18 }}>{valueFrequency}</Text>
                        <Feather name='chevron-right' size={30}
                            onPress={() => {
                                setValueFrequency(valueFrequency + 1)
                                props.updateOneValue('repeat', 0, (valueFrequency + 1))
                                let newArr: any = frequencys.map((item: any, i: number) => {
                                    if (i == 0 && item == valueFrequency) {
                                        return item + 1
                                    } else {
                                        return item
                                    }
                                })
                                setFrequencys(newArr)
                            }}
                        />
                    </>
                }

                <Text style={[styles.secondColorText, { color: subtittleTextColor }]}>Vezes</Text>
            </View>
            <View style={styles.frequencyView}>

            </View>
            {props.idUpdate == null ?
                <>
                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                        Valor
                            </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.secondColorText, { color: subtittleTextColor, marginRight: 10, fontSize: 18 }]}>
                            R$
                                </Text>
                        <TextInput
                            keyboardType='numeric'
                            onChange={props.updateValues('amount', 0, false)}
                            value={valuesArray[0].amount.toString()}
                            style={styles.InputTextValue}
                        />
                    </View>
                </>
                : null
            }
        </>
    )
}

const styles = StyleSheet.create({
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginTop: 13,
    },
    dateView: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        flexDirection: 'row'
    },
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 19,
    },
    secondColorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
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
})