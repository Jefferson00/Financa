import React from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { MaterialIcons,  Ionicons } from '@expo/vector-icons'

import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';


import {useSelectedMonthAndYear} from "../../../contexts/selectMonthAndYear"
import {useStylesStates} from "../../../contexts/stylesStates"
import {useResultsDB} from "../../../contexts/resultsDBStates"

import {EntriesValues, ValuesValues} from "../../../interfaces"

export default function EntriesResults({props}:{props:any}){

    const {entries, valuesList} = useResultsDB()
    const { selectedMonth, selectedYear} = useSelectedMonthAndYear()
    const {tittleTextColor} = useStylesStates()

    return(
        <View style={{ flex: 1, height: '100%' }}>
        <ScrollView style={styles.scrollViewContainer}>
            { }
            {entries.map((entrie:EntriesValues, index: number) => {
                var totalValues = 0
                var opac = false
                var atrs = false
                var borderColor = '#ffffff'
                if (!entrie.received || selectedMonth != props.CurrentMonth || selectedYear != props.CurrentYear) {
                    opac = true
                }
                if (!entrie.received && entrie.day <= props.todayDate.getDate()) {
                    atrs = true
                    borderColor = tittleTextColor
                }
                if(selectedMonth != props.CurrentMonth || selectedYear != props.CurrentYear){
                    atrs = false
                    borderColor = '#ffffff'
                }
                return (
                    <View key={index}>
                    
                    {opac?
                        <TouchableOpacity
                        style={[styles.earningsItemView, {borderColor:borderColor, borderWidth:1}]}
                        onPress={() => props.showModal(entrie.id, totalValues)}
                        >
                        <MaterialIcons name="monetization-on" size={40} color={tittleTextColor+'AA'} />
                        {valuesList.map((value:ValuesValues) => {
                            if (entries[index].id == value.entries_id) {
                                totalValues = totalValues + value.amount
                            }
                        })}

                        <View style={styles.earningTextView}>
                            <Text numberOfLines={1} style={[styles.earningTittleText, { color: tittleTextColor+'AA', width: 150 }]}>
                                {entrie.title}
                            </Text>
                            <Text style={[styles.earningDateText, { color: tittleTextColor+'AA' }]}>
                                {entrie.day}/{Functions.convertDtToStringMonth(selectedMonth)}
                            </Text>
                        </View>

                        <NumberFormat
                            value={totalValues}
                            displayType={'text'}
                            thousandSeparator={true}
                            format={Functions.currencyFormatter}
                            renderText={value => <Text style={[styles.earningTittleText, { color: tittleTextColor+'AA' }]}> {value} </Text>}
                        />

                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.earningsItemView, {borderColor:borderColor, borderWidth:1 }]}
                        onPress={() => props.showModal(entrie.id, totalValues)}
                        >
                        <MaterialIcons name="monetization-on" size={40} color={tittleTextColor} />
                        {valuesList.map((value:ValuesValues) => {
                            if (entries[index].id == value.entries_id) {
                                totalValues = totalValues + value.amount
                                //console.log(totalValues)
                            }
                        })}

                        
                        <View style={styles.earningTextView}>
                            <Text numberOfLines={1} style={[styles.earningTittleText, { color: tittleTextColor, width: 150 }]}>
                                {entrie.title}
                            </Text>
                            <Text style={[styles.earningDateText, { color: tittleTextColor }]}>
                                {entrie.day}/{Functions.convertDtToStringMonth(selectedMonth)}
                            </Text>
                        </View>

                        <NumberFormat
                            value={totalValues}
                            displayType={'text'}
                            thousandSeparator={true}
                            format={Functions.currencyFormatter}
                            renderText={value => <Text style={[styles.earningTittleText, { color: tittleTextColor }]}> {value} </Text>}
                        />

                    </TouchableOpacity>
                    }
                    
                    {atrs? 
                    <Ionicons name="alert-circle" size={40} color={tittleTextColor} style={styles.alertSign}/>
                    :null}
                    </View>
                )
            })}
        </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    alertSign:{
        position:'absolute',
        right:0,
        marginRight:46,
        elevation:7,
        zIndex:5,
    },
   
    scrollViewContainer: {
        minHeight: 350,
        marginTop: 20,
        flex: 1,
    },
   

    earningsItemView: {
        marginHorizontal: 24,
        marginTop: 22,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 6,
        shadowColor: '#CAD3DD',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        zIndex:0,
    },
    earningsItemViewOpacity: {
        opacity: 0.8,
    },
    earningTextView: {

    },
    earningTittleText: {
        color: '#1A8289',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
    earningDateText: {
        color: '#1A8289',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
  
})
