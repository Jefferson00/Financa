import React , {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View ,ScrollView} from 'react-native';
import { MaterialIcons,  Ionicons } from '@expo/vector-icons'

import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';


import EntriesDB from '../../../services/entriesDB'
import ValuesDB from '../../../services/valuesDB'

export default function Results() {



    const [entries, setEntries] = useState([])
    const [itemSelected, setItemSelected] = useState('Ganhos')

    const todayDate = new Date()
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    function handleEarnings(){
        setItemSelected('Ganhos')
    }

    function handleExpanses(){
        setItemSelected('Despesas')
    }

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
                <TouchableOpacity 
                    style={[
                        styles.selectButton,  
                        {backgroundColor: itemSelected=='Ganhos'? '#1A8289' : '#91D4D9',
                        borderTopLeftRadius:20,
                        }
                    ]}
                    onPress={handleEarnings}
                >
                        <Text style={[
                            styles.titleButton,
                            {color: itemSelected=='Ganhos'? '#ffffff' : '#1A8289'}
                        ]}>
                            Ganhos
                        </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[
                        styles.selectButton,
                        {backgroundColor: itemSelected=='Despesas'? '#FF4835' : '#FFC8C2',
                        borderTopRightRadius:20,
                        }
                    ]}
                    onPress={handleExpanses}
                >
                    <Text style={[
                        styles.titleButton,
                        {color: itemSelected=='Despesas'? '#ffffff' : '#FF4835'}
                    ]}>
                        Despesas
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
            <Text style={styles.titleContainer}>
                Atrasados
            </Text>

            {entries.map((entr:any,index:number)=>{
                //console.log(entr.received)
                if (entr.received == 0 && entr.type == itemSelected){
                    let colorText = ''
                    let bgcolor = ''
                        entr.type == 'Ganhos' ? colorText = '#13585C' : colorText = '#972A1F'
                        entr.type == 'Ganhos' ? bgcolor = 'rgba(26, 130, 137, 0.4)' : bgcolor = 'rgba(255, 72, 53, 0.4)'
                    return(
                        <View style={[styles.resultItem, { backgroundColor: bgcolor}]} key={index}>
                            <MaterialIcons 
                                name="monetization-on" 
                                size={40} 
                                color={colorText} />
                            
                            <View>
                                <Text numberOfLines={1} style={[
                                    styles.earningTittleText, { color: colorText, width: 150 }
                                ]}>
                                    {entr.title}
                                </Text>
                                <Text style={[styles.earningDateText, { color: colorText}]}>
                                     
                                </Text>
                            </View>
                        </View>
                    )
                }

            })}


            <Text style={styles.titleContainer}>
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
        titleContainer:{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 14,
            marginTop:20,
            marginLeft:17,
        },

        resultItem:{
            marginHorizontal: 11,
            marginTop: 20,
            height: 65,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
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