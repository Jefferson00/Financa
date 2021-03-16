import React, { useContext } from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { MaterialIcons,  MaterialCommunityIcons  } from '@expo/vector-icons'

import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';
import { DataBDContext } from "../../../contexts/dataBDContext";
import { NewEntriesContext } from "../../../contexts/newEntriesContext";
import { MainContext } from "../../../contexts/mainContext";
import { StylesContext } from "../../../contexts/stylesContext";
import NoResultsView from "./noResultsView";

interface EntriesData {
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
}

export default function EntriesResults() {

    const { entriesByDate, entriesValuesByDate } = useContext(DataBDContext)
    const {todayDate} = useContext(MainContext)
    const {typeOfEntrie} = useContext(NewEntriesContext)
    const {entriePrimaryColor, showEntrieModal} = useContext(StylesContext)

    const entriesByDateByType = entriesByDate.filter(entrie => entrie.type == typeOfEntrie)
    
    // order by days
    entriesByDateByType.sort((a:EntriesData,b:EntriesData) => a.day - b.day)

    // order by not received entries
    /*entriesByDateByType.sort(function(a:EntriesData,b:EntriesData){
        return (a.received === b.received) ? 0 : a ? -1 : 1
    })*/

    return (
        <View style={{ flex: 1, height: '100%' }}>
            <ScrollView style={styles.scrollViewContainer}>
                {entriesByDateByType.length > 0 ? entriesByDateByType.map((entrie: EntriesData, index: number) => {
                    let totalValues = 0
                    let notReceived = false
                    let isLate = false
                    let borderColor = "#ffffff"
                    let opacColor = "#ffffffAA"
                    entriesValuesByDate.map((value)=>{
                        if (entriesByDateByType[index].id == value.entries_id){
                            totalValues = totalValues + value.amount
                        }
                    })

                    if (!entrie.received) notReceived = true
                    if(!entrie.received && entrie.day <= todayDate.getDate()){
                        isLate = true
                        borderColor = entriePrimaryColor
                    }

                    if (notReceived) {
                        opacColor = entriePrimaryColor+"AA"
                    }else{
                        opacColor = entriePrimaryColor
                    }

                    return (
                        <View key={index}>
                            <TouchableOpacity
                                style={[styles.earningsItemView, {borderColor:borderColor, borderWidth:1}]}
                                onPress={()=> showEntrieModal(entrie.id, totalValues)}
                            >
                                <MaterialIcons name="monetization-on" size={40} color={opacColor} />

                                <View style={styles.earningTextView}>
                                    <Text numberOfLines={1} 
                                          style={[styles.earningTittleText, {color:opacColor, width:150}]}>
                                        {entrie.title}
                                    </Text>
                                    <Text style={[styles.earningDateText, {color:opacColor}]}>
                                        {entrie.day}/{Functions.convertDtToStringMonth(3)}
                                    </Text>
                                </View>

                                <NumberFormat
                                    value={totalValues}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    format={Functions.currencyFormatter}
                                    renderText={value => 
                                        <Text style={[styles.earningTittleText,{color:opacColor}]}> 
                                            {value} 
                                        </Text>
                                    }
                                />
                            </TouchableOpacity>

                            {isLate &&
                            <MaterialCommunityIcons  name="alert-circle" size={40} color={entriePrimaryColor} style={styles.alertSign} />
                            }

                        </View>
                    )
                })
                :
                <NoResultsView/>
                }


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    alertSign: {
        position: 'absolute',
        right: 0,
        marginRight: 46,
        elevation: 7,
        zIndex: 5,
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
        zIndex: 0,
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
