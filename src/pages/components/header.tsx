import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Feather} from '@expo/vector-icons'

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useStylesStates} from '../../contexts/stylesStates'
import {useResultsDB} from '../../contexts/resultsDBStates'

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB'

import Functions from '../../functions'

export default function Header(){

    const {selectedMonth, selectedYear, setSelectedMonth, setSelectedYear, setNoBalance} = useSelectedMonthAndYear();
    const {monthColor} = useStylesStates();
    const {entries, setEntries, setValuesList} = useResultsDB();
  
      /**Função que mostra os dados do mês seguinte */

  function handleNextMonth() {
    let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
    EntriesDB.findByDate(parseInt(nextDtObj.dt)).then((res: any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(nextDtObj.dt)).then((res: any) => {
      setValuesList(res._array)
      setNoBalance(false)
    }).catch(err => {
      setValuesList([])
      console.log(err)
      setNoBalance(true)
    })

    setSelectedMonth(nextDtObj.nextMonth)
    setSelectedYear(nextDtObj.nextYear)
  }

  /**Função que mostra os dados do mês anterior */
  function handlePrevMonth() {
    let prevDtObj = Functions.prevMonth(selectedMonth, selectedYear)

    EntriesDB.findByDate(parseInt(prevDtObj.dt)).then((res: any) => {
      setEntries(res._array)
    }).catch(err => {
      setEntries([])
      console.log(err)
    })

    ValuesDB.findByDate(parseInt(prevDtObj.dt)).then((res: any) => {
      setValuesList(res._array)
      setNoBalance(false)
    }).catch(err => {
      setValuesList([])
      setNoBalance(true)
      console.log(err)
    })

    setSelectedMonth(prevDtObj.prevMonth)
    setSelectedYear(prevDtObj.prevYear)
  }

    return(
        <View style={styles.monthView}>
            <TouchableOpacity  onPress={handlePrevMonth}>
            <Feather name="chevron-left" size={40} color={monthColor} />
            </TouchableOpacity>
            <Text style={[styles.monthText, { color: monthColor }]}>
                {Functions.convertDtToStringMonth(selectedMonth)}  {selectedYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
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