import React , {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View ,ScrollView} from 'react-native';
import { MaterialIcons,  Ionicons } from '@expo/vector-icons'

import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';

import {useSelectedMonthAndYear} from "../../../contexts/selectMonthAndYear"

import EntriesDB from '../../../services/entriesDB'
import ValuesDB from '../../../services/valuesDB'

export default function Results() {

    const { selectedMonth, selectedYear} = useSelectedMonthAndYear()
    const [entries, setEntries] = useState([])

    const todayDate = new Date()
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    useEffect(() => {
        let firstDate
            /*Converte para a data em String e no formato que é salvo no banco de dados*/
            if (CurrentMonth < 10) {
                firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
            } else {
                firstDate = CurrentYear.toString() + CurrentMonth.toString()
            }
            //Ex: firstDate: '202101'

            //Procura todos os ganhos e despesas correspondente a data atual ao abrir a aplicação
            EntriesDB.findByDate(parseInt(firstDate)).then((res: any) => {
                setEntries(res._array)
                
            }).catch(err => {
                console.log(err)
            })
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.topSelectButtons}>
                <TouchableOpacity style={[
                    styles.selectButton,
                    {backgroundColor:'#1A8289',
                    borderTopLeftRadius:20,
                    }
                ]}>
                    <Text style={[
                        styles.titleButton,
                        {color:'#ffffff'}
                    ]}>
                        Ganhos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.selectButton,
                    {backgroundColor:'#FFC8C2',
                    borderTopRightRadius:20,
                    }
                ]}>
                    <Text style={[
                        styles.titleButton,
                        {color:'#FF4835'}
                    ]}>
                        Despesas
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
            <Text style={styles.titleButton}>
                Atrasados
            </Text>

            {entries.map((entr:any,index:number)=>{
                console.log(entr.received)
                if (entr.received == 0){
                    return(
                        <View style={styles.resultItem} key={index}>
                            <MaterialIcons 
                                name="monetization-on" 
                                size={40} 
                                color={'#13585C'} />
                            
                            <View>
                                <Text numberOfLines={1} style={[
                                    styles.earningTittleText, { color: '#13585C', width: 150 }
                                ]}>
                                    Sálario
                                </Text>
                                <Text style={[styles.earningDateText, { color: '#13585C'}]}>
                                    10/{Functions.convertDtToStringMonth(selectedMonth)}
                                </Text>
                            </View>
                        </View>
                    )
                }

            })}


            <Text style={styles.titleButton}>
                Nos próximos dias...
            </Text>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
        container:{
            flex:1,
            borderRadius:20,
            borderWidth:1,
            borderColor:'#d2d2d2',
            marginVertical:30,
            marginHorizontal:30,
        },
        topSelectButtons:{
            flexDirection:'row',
        },
        selectButton:{
            width:'50%',
            justifyContent:'center',
            alignItems:'center',
            height:30,
        },
        titleButton:{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 14,
        },

        resultItem:{
            marginHorizontal: 11,
            marginTop: 22,
            height: 65,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: "rgba(26, 130, 137, 0.4)",
            borderRadius: 20,
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