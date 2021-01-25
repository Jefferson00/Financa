import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Feather} from '@expo/vector-icons'

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useStylesStates} from '../../contexts/stylesStates'

import Functions from '../../functions'

export default function Header({functions}:{functions:any}){

    const {selectedMonth, selectedYear} = useSelectedMonthAndYear();
    const {monthColor} = useStylesStates();
  

    return(
        <View style={styles.monthView}>
            <TouchableOpacity  onPress={functions.handlePrevMonth}>
            <Feather name="chevron-left" size={40} color={monthColor} />
            </TouchableOpacity>
            <Text style={[styles.monthText, { color: monthColor }]}>
                {Functions.convertDtToStringMonth(selectedMonth)}  {selectedYear}
            </Text>
            <TouchableOpacity onPress={functions.handleNextMonth}>
            <Feather name="chevron-right" size={40} color={monthColor} />
            </TouchableOpacity>
        </View>
    )
    
}

const styles = StyleSheet.create({
    monthView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
      },
      monthText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        marginHorizontal: 5
      },
})