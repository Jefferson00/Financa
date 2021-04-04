import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Foundation , Ionicons, Entypo} from '@expo/vector-icons'
import NumberFormat from 'react-number-format';
import Functions from '../../../functions/index'
import { DataBDContext } from '../../../contexts/dataBDContext';
import CategoryIcon from './categoryIcon';
import { MainContext } from '../../../contexts/mainContext';
import { StylesContext } from '../../../contexts/stylesContext';


export default function LatestTransactions() {
    
    const [seeTransactions, setSeeTransactions] = useState(true)

    const {latestEntries } = useContext(DataBDContext)
    const {seeBalanceValues } = useContext(MainContext)
    const {colorScheme } = useContext(StylesContext)

    const ltsEntries = latestEntries.slice(Math.max(latestEntries.length - 3, 0))

    let expansesTextColor = ""
    let earningsTextColor = ""

    colorScheme == 'dark' ? expansesTextColor = '#FF4835' : expansesTextColor = '#CC3728'
    colorScheme == 'dark' ? earningsTextColor = '#24DBBA' : earningsTextColor = '#1A8289'

    return (
        <View style={
            [styles.container, 
            colorScheme=='dark' ? 
              {backgroundColor:'#2B2B2B'} 
            : {backgroundColor:'#ffffff'}
            ]}>
            <View style={styles.titleView}>
                <Text style={[styles.title, colorScheme == 'dark' ? {color:'#ffffff'} : {color:'#3C93F9'}]}>
                    Últimas Transações
                </Text>
                {/*
                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> setSeeTransactions(!seeTransactions)}>
                        {seeTransactions?
                        <Ionicons name="eye-off" size={30} color="#d2d2d2" />
                        :
                        <Ionicons name="eye" size={30} color="#d2d2d2"  />
                        }
                    </TouchableOpacity>                
                */}
            </View>

            {ltsEntries.length > 0 ? ltsEntries.map((entr: any, index: number) => {
                let month = entr.month

                return (
                    <View style={styles.listView} key={index}>
                        {seeBalanceValues?
                        <>
                            <View style={{alignItems:'center',justifyContent:'center', marginVertical:2.5}}>
                                <CategoryIcon category={entr.category} type={entr.type}/>
                            </View>
                            <View style={styles.centerView}>
                                <Text style={[
                                    styles.itemText,
                                    { color: entr.type == 'Ganhos' ? earningsTextColor : expansesTextColor }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {entr.title}
                                </Text>
                                {entr.amount > 0 ?
                            
                                    <NumberFormat
                                        value={entr.amount }
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        format={Functions.currencyFormatter}
                                        renderText={value => 
                                            <Text style={[
                                                styles.itemText,
                                                { color: entr.type == 'Ganhos' ? earningsTextColor : expansesTextColor}
                                            ]}> 
                                            {entr.type == 'Despesas'? '- ' + value: value} 
                                            </Text>
                                        }
                                    />
                                    :
                                    <Text style={[
                                        styles.itemText,
                                        { color: entr.type == 'Ganhos' ? earningsTextColor : expansesTextColor}
                                    ]}> 
                                    R$ 0,00 
                                    </Text>
                                }
                            </View>


                            <Text style={[styles.dateText, colorScheme == 'dark' && {color:'#ffffff'}]}>
                                {entr.day}/{Functions.convertDtToStringMonth(month)}
                            </Text>
                        </>
                        :
                            <View style={[styles.censoredValue, 
                                colorScheme == 'dark' ? 
                                {backgroundColor:'rgba(247, 241, 241, 0.40)'} : 
                                {backgroundColor:'rgba(247, 241, 241, 0.80)'}
                            ]}/>
                        }
                    </View>
                )
            }) : 
                <View style={styles.noResultsView}>
                    <Text style={styles.noResultText}>Sem Transações</Text>
                    <Entypo name="emoji-neutral" size={40} color="#3C93F9AA" />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height:161,
        marginHorizontal: 26,
        marginTop:23,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C8C8C8',
        paddingVertical: 10,
        paddingHorizontal: 26,
    },
    titleView: {
        marginBottom:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
    },

    listView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    itemText: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        maxWidth:150
    },
    dateText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        color: '#444444',
    },
    censoredValue:{
        height:25,
        width:'100%',
        backgroundColor:'rgba(247, 241, 241, 0.80)',
    },
    centerView:{
        justifyContent:'space-between', 
        flexDirection:'row',
        flex:1,
        marginHorizontal:20,
    },
    noResultsView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    noResultText:{
        color: '#3C93F9',
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
    }
})