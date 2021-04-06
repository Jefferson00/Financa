import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { StylesContext } from '../../contexts/stylesContext';
import { MainContext } from '../../contexts/mainContext';
import Functions from "../../utils"
import { NewEntriesContext } from '../../contexts/newEntriesContext';
import { useNavigation } from '@react-navigation/core';
import { DrawerActions } from '@react-navigation/native'



export default function Header() {

  const {monthColor, selectedEntrieId} = useContext(StylesContext)
  const {selectedYear, selectedMonth, handleNextMonth, handlePrevMonth} = useContext(MainContext)
  const {calendarDate, entrieIdUpdate} = useContext(NewEntriesContext)

  const nav = useNavigation()

  function openSideBar(){
    nav.dispatch(DrawerActions.openDrawer())
  }

  function nextMonth(){
    handleNextMonth()
    //console.log("selected Entrie ID: "+selectedEntrieId)
  }
  
  useEffect(()=>{
    if (entrieIdUpdate == 0){
        calendarDate.setMonth(selectedMonth-1)
        calendarDate.setFullYear(selectedYear)
    }
  },[selectedYear, selectedMonth])

  return (
    <View style={styles.headerView}>
        <View style={styles.monthView}>
          <TouchableOpacity onPress={handlePrevMonth} hitSlop={styles.hitSlop}>
            <Feather name="chevron-left" size={40} color={monthColor} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: monthColor }]}>
              {Functions.convertDtToStringMonth(selectedMonth)} { selectedYear}
          </Text>
          <TouchableOpacity onPress={nextMonth} hitSlop={styles.hitSlop}>
            <Feather name="chevron-right" size={40} color={monthColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.monthView}>
          <TouchableOpacity onPress={openSideBar} hitSlop={styles.hitSlop}>
            <Feather name="menu" size={25} color={monthColor} />
          </TouchableOpacity>
        </View>
    </View>
  )

}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 13,
  },
  monthView:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  hitSlop:{
    top:20,
    bottom:20,
    left:30,
    right:30,
  },
  monthText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginHorizontal: 5
  },
})