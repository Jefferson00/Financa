import React, { useContext, useEffect } from "react"
import { StyleSheet, Text, View } from 'react-native'


import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';
import { DataBDContext } from "../../../contexts/dataBDContext";
import ModalContent from "./modalContent";
import { MainContext } from "../../../contexts/mainContext";
import { NewEntriesContext } from "../../../contexts/newEntriesContext";

interface EntriesValuesData{
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
}


export default function Balance(){

    const {entriesValuesByDate} = useContext(DataBDContext)
    const {selectedMonth, selectedYear, currentMonth, currentYear} = useContext(MainContext)
    const {typeOfEntrie} = useContext(NewEntriesContext)

    let SumOfAmountsArray1: any = [2000,3000,4000]
    let SumOfAmountsArray2: any = [2000,3000,4000,5000]

    /*entriesValuesByDate.map((value:EntriesValuesData)=>{
           
        if(selectedMonth == currentMonth && selectedYear == currentYear){
            //console.log(":::received:::"+value.received)
            //console.log(":::type:::"+value.type)
            if(value.received && value.type == typeOfEntrie) {
                //console.log("::::::::::::"+typeOfEntrie)
                SumOfAmountsArray1.push(value.amount)
            }
            
        }
        if (value.amount != null && value.amount != 0 && value.type == typeOfEntrie) SumOfAmountsArray2.push(value.amount)
    })*/
    //console.log("::::::::::::"+SumOfAmountsArray2)

    return (
        <View style={styles.balanceView}>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.currentBalanceText}>
                        Atual
                    </Text>
                    {SumOfAmountsArray1 != 0 && selectedMonth == currentMonth && selectedYear == currentYear?
                        <NumberFormat
                        value={SumOfAmountsArray1.reduce((a: any, b: any) => a + b, 0)}
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
                            Estimado
                    </Text>
                    {SumOfAmountsArray2 != 0 ?
                        <NumberFormat
                            value={SumOfAmountsArray2.reduce((a: any, b: any) => a + b, 0)}
                            displayType={'text'}
                            thousandSeparator={true}
                            format={Functions.currencyFormatter}
                            renderText={value => <Text style={styles.estimatedBalanceTextValue}> {value} </Text>}
                        />
                    :
                        <Text style={styles.estimatedBalanceTextValue}>R$ 0,00</Text>
                    }
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
