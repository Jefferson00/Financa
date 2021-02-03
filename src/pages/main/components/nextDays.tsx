import React from 'react'
import { StyleSheet, Text, ScrollView, View} from 'react-native';

import {useResultsDB} from '../../../contexts/resultsDBStates'

import Functions from '../../../functions'

import {EntriesValues} from "../../../interfaces"

export default function NextDays({props}:{props:any}){

    const {nextEntries,nextMonthEntries} = useResultsDB()
    return(
    <ScrollView style={{ maxHeight: 95, elevation: 5 }}>
          {nextEntries.map((ear:EntriesValues, index:number) => {
            if (ear.day >= props.todayDate.getDate() && ear.day <= (props.todayDate.getDate() + 10) && !ear.received) {
              let color
              if (ear.type == 'Ganhos') {
                color = '#1A8289'
              } else {
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day + '  ' + Functions.convertDtToStringMonth(props.todayDate.getMonth() + 1)}
                  </Text>
                </View>
              )
            }
          })
          }
          {props.todayDate.getDate() + 5 > 30 && nextMonthEntries.map((ear:EntriesValues, index:number) => {
            if (ear.day <= 5) {
              let color
              if (ear.type == 'Ganhos') {
                color = '#1A8289'
              } else {
                color = '#CC3728'
              }
              return (
                <View style={styles.nextDaysContent} key={index}>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>{ear.title}</Text>
                  <Text style={[styles.nextDaysContentText, { color: color }]}>
                    {ear.day + '  ' + Functions.convertDtToStringMonth(props.todayDate.getMonth() + 2)}
                  </Text>
                </View>
              )
            }
          })}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    nextDaysText: {
        color: '#15695A',
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
      },
    
      nextDaysContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 5,
        marginHorizontal: 26,
        borderColor: 'transparent',
        borderBottomColor: '#dadada',
        borderWidth: 1,
    
      },
    
      nextDaysContentText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
      }
})


