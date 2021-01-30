import React from "react"
import { StyleSheet, Text, View } from 'react-native'


import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';

import {useSelectedMonthAndYear} from "../../../contexts/selectMonthAndYear"
import {useStylesStates} from "../../../contexts/stylesStates"
import {useResultsDB} from "../../../contexts/resultsDBStates"

export default function Balance({props}:{props:any}){

    const { selectedMonth, selectedYear} = useSelectedMonthAndYear()
    const { mainText1, mainText2} = useStylesStates()
    const {valuesList} = useResultsDB()

    valuesList.map((value: any) => {
        if (selectedMonth == props.CurrentMonth && selectedYear == props.CurrentYear){
            if (value.received && value.type == props.item) props.cont2.push(value.amount)
        }
        if (value.amount != null && value.amount != 0 && value.type == props.item) props.cont.push(value.amount)
    })
    
    return (
        <View style={styles.balanceView}>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.currentBalanceText}>
                        {mainText1}
                    </Text>
                    {selectedMonth == props.CurrentMonth && selectedYear == props.CurrentYear?
                        <NumberFormat
                        value={props.cont2.reduce((a: any, b: any) => a + b, 0)}
                        displayType={'text'}
                        thousandSeparator={true}
                        format={Functions.currencyFormatter}
                        renderText={value => <Text style={styles.currentBalanceTextValue}> {value} </Text>}
                        />
                        :
                        <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
                    }
                </View>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.estimatedBalanceText}>
                        {mainText2}
                    </Text>
                    <NumberFormat
                        value={props.cont.reduce((a: any, b: any) => a + b, 0)}
                        displayType={'text'}
                        thousandSeparator={true}
                        format={Functions.currencyFormatter}
                        renderText={value => <Text style={styles.estimatedBalanceTextValue}> {value} </Text>}
                    />
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    balanceView: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
    },

    currentBalanceView: {
        justifyContent: 'center',
        marginHorizontal: 26,
    },

    currentBalanceText: {
        color: '#ffffff',
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        textAlign: 'center'
    },

    currentBalanceTextValue: {
        color: '#ffffff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        textAlign: 'center'
    },

    estimatedBalanceText: {
        color: 'rgba(255, 255, 255, 0.62);',
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        textAlign: 'center'
    },

    estimatedBalanceTextValue: {
        color: 'rgba(255, 255, 255, 0.62);',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        textAlign: 'center'
    },

})
