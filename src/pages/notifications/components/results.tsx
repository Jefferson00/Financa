import React , {useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View ,ScrollView} from 'react-native';
import { MaterialIcons,  Entypo  , Octicons} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Functions from '../../../utils'
import NumberFormat from 'react-number-format';


import EntriesDB from '../../../services/entriesDB'
import ValuesDB from '../../../services/valuesDB'
import { DataBDContext } from '../../../contexts/dataBDContext';
import { StylesContext } from '../../../contexts/stylesContext';



export default function Results() {
    
    const [itemSelected, setItemSelected] = useState('Ganhos')
    const [hasLateEarnings, setHasLateEarnings] = useState(false)
    const [hasLateExpanses, setHasLateExpanses] = useState(false)
    const [hasNextDaysEarnings, setHasNextDaysEarnings] = useState(false)
    const [hasNextDaysExpanses, setHasNextDaysExpanses] = useState(false)
    const {entriesByCurrentDate, entriesByNextMonth} = useContext(DataBDContext)
    const {colorScheme, isDarkTheme} = useContext(StylesContext)

    const todayDate = new Date()
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    let containerBgColor = ""
    let textColor = ""
    let earningsColorText = ""
    let expansesColorText = ""
    let earningsColorBg = ""
    let expansesColorBg = ""

    colorScheme == "dark" || isDarkTheme ? containerBgColor = "#2A2A2A" : containerBgColor = "#ffffff"
    colorScheme == "dark" || isDarkTheme ? textColor = "#ffffff" : textColor = "#080808"
    colorScheme == "dark" || isDarkTheme ? earningsColorText = "#ffffff" : earningsColorText = "#13585C"
    colorScheme == "dark" || isDarkTheme ? expansesColorText = "#ffffff" : expansesColorText = "#972A1F"
    colorScheme == "dark" || isDarkTheme ? earningsColorBg = "rgba(26, 130, 137, 0.4)" : earningsColorBg = "rgba(26, 130, 137, 0.4)"
    colorScheme == "dark" || isDarkTheme ? expansesColorBg = "rgba(255, 72, 53, 0.4)" : expansesColorBg = "rgba(255, 72, 53, 0.4)"

    function handleEarnings(){
        setItemSelected('Ganhos')
    }

    function handleExpanses(){
        setItemSelected('Despesas')
    }

    useEffect(()=>{
        let lateEarningsInCurrentMonth = []
        let lateExpansesInCurrentMonth = []
        entriesByCurrentDate.map((entr,index)=>{
            if (!entr.received && entr.type == "Ganhos" && entr.day <= todayDate.getDate()){
                lateEarningsInCurrentMonth.push(entr)
                setHasLateEarnings(true)
            }
            if (!entr.received && entr.type == "Despesas" && entr.day <= todayDate.getDate()){
                lateExpansesInCurrentMonth.push(entr)
                setHasLateExpanses(true)
            }
            if (!entr.received && entr.type == "Ganhos" && entr.day > todayDate.getDate() && entr.day <= (todayDate.getDate()+5)){
                setHasNextDaysEarnings(true)
            }
            if (!entr.received && entr.type == "Despesas" && entr.day > todayDate.getDate() && entr.day <= (todayDate.getDate()+5)){
                setHasNextDaysExpanses(true)
            }
        })

        todayDate.getDate() >= 27 && entriesByNextMonth.map((entrie=>{
            if (!entrie.received && entrie.type == "Ganhos" && entrie.day <= 5){
                setHasNextDaysEarnings(true)
            }
            if (!entrie.received && entrie.type == "Despesas" && entrie.day <= 5){
                setHasNextDaysExpanses(true)
            }
        }))
    },[])


    return(
        <View style={[
            styles.container,
            {backgroundColor:containerBgColor}
        ]}>
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
                        {hasLateEarnings || hasNextDaysEarnings && 
                         <Octicons 
                          name="primitive-dot"
                          size={25} 
                          color={itemSelected=='Ganhos'? 'transparent' : '#1A8289'} 
                          style={{position:'absolute', right:15, top: -10}}
                        />
                        }
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
                    {hasLateExpanses || hasNextDaysExpanses && 
                         <Octicons 
                          name="primitive-dot"
                          size={25} 
                          color={itemSelected=='Despesas'? 'transparent' : '#FF4835'} 
                          style={{position:'absolute', right:30, top: -10}}
                        />
                    }
                </TouchableOpacity>
            </View>

            <ScrollView>
            {hasLateEarnings && itemSelected == "Ganhos" && 
                <Text style={[styles.titleContainer, {color:textColor}]}>Atrasados</Text>}
            {hasLateExpanses && itemSelected == "Despesas" && 
                <Text style={[styles.titleContainer, {color:textColor}]}>Atrasados</Text>}
            

            {entriesByCurrentDate.map((entr:any,index:number)=>{
                //console.log(entr.received)
                if (entr.received == 0 && entr.type == itemSelected && entr.day <= todayDate.getDate()){
                    let colorText = ''
                    let bgcolor = ''
                        entr.type == 'Ganhos' ? colorText = earningsColorText : colorText = expansesColorText
                        entr.type == 'Ganhos' ? bgcolor = earningsColorBg : bgcolor = expansesColorBg
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
                                     {entr.day}/ {Functions.convertDtToStringMonth(CurrentMonth)}
                                </Text>
                            </View>
                        </View>
                    )
                }
            })}

            {hasNextDaysEarnings && itemSelected == "Ganhos" && 
            <Text style={[styles.titleContainer, {color:textColor}]}>Nos próximos dias...</Text>}
            {hasNextDaysExpanses && itemSelected == "Despesas" &&
             <Text style={[styles.titleContainer, {color:textColor}]}>Nos próximos dias...</Text>}

            {entriesByCurrentDate.map((entr:any,index:number)=>{
                if (entr.received == 0 && entr.type == itemSelected && entr.day > todayDate.getDate() && entr.day <= (todayDate.getDate()+5)){
                    let colorText = ''
                    let bgcolor = ''
                        entr.type == 'Ganhos' ? colorText = earningsColorText : colorText = expansesColorText
                        entr.type == 'Ganhos' ? bgcolor = earningsColorBg : bgcolor = expansesColorBg
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
                                    {entr.day}/ {Functions.convertDtToStringMonth(CurrentMonth)}
                                </Text>
                            </View>
                        </View>
                    )
                }

            })}
            {todayDate.getDate() >= 27 &&
                entriesByNextMonth.map((entrie,index)=>{
                    if (!entrie.received && entrie.type == itemSelected && entrie.day <= 5){
                        let colorText = ''
                        let bgcolor = ''
                        entrie.type == 'Ganhos' ? colorText = earningsColorText : colorText = expansesColorText
                        entrie.type == 'Ganhos' ? bgcolor = earningsColorBg : bgcolor = expansesColorBg
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
                                        {entrie.title}
                                    </Text>
                                    <Text style={[styles.earningDateText, { color: colorText}]}>
                                        {CurrentMonth + 1 > 12 ?
                                            entrie.day +"/"+Functions.convertDtToStringMonth(1)
                                            :
                                            entrie.day +"/"+Functions.convertDtToStringMonth(CurrentMonth + 1)
                                        }
                                    </Text>
                                </View>
                            </View>
                        )
                    }
                })
            }
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
        noResultView:{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
        },
        noResultText:{
            color: '#3C93F9',
            fontSize: 14,
            fontFamily: 'Poppins_500Medium',
        }
  })