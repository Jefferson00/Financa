import React from "react"
import { StyleSheet, Text, View } from 'react-native'


import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';


export default function Balance(){

    return (
        <View style={styles.balanceView}>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.currentBalanceText}>
                        Seila
                    </Text>

                        :
                        <Text style={styles.currentBalanceTextValue}>R$ 0,00</Text>
        
                </View>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.estimatedBalanceText}>
                            fsdgsdgd
                    </Text>
                    <NumberFormat
                        value={4500}
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
