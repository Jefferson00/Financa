import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Foundation , Ionicons} from '@expo/vector-icons'
import NumberFormat from 'react-number-format';
import Functions from '../../../functions/index'
import { DataBDContext } from '../../../contexts/dataBDContext';


export default function LatestTransactions() {
    
    const [seeTransactions, setSeeTransactions] = useState(true)

    const {latestEntries } = useContext(DataBDContext)

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>
                    Últimas Transações
                </Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> setSeeTransactions(!seeTransactions)}>
                    {seeTransactions?
                    <Ionicons name="eye-off" size={30} color="#d2d2d2" />
                    :
                    <Ionicons name="eye" size={30} color="#d2d2d2"  />
                    }
                </TouchableOpacity>
            </View>

            {latestEntries.map((entr: any, index: number) => {
                let month = parseInt(Functions.toMonthAndYear(entr.entrieDtStart).month)

                return (
                    <View style={styles.listView} key={index}>
                        {seeTransactions?
                        <>
                            <Foundation 
                                name="dollar" 
                                size={30} 
                                color={entr.type == 'Ganhos' ? '#136065' : '#CC3728'}/>
                            <Text style={[
                                styles.itemText,
                                { color: entr.type == 'Ganhos' ? '#136065' : '#CC3728' }
                                ]}>
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
                                            { color: entr.type == 'Ganhos' ? '#136065' : '#CC3728'}
                                        ]}> 
                                        {entr.type == 'Despesas'? '- ' + value: value} 
                                        </Text>
                                    }
                                />
                                :
                                <Text style={[
                                    styles.itemText,
                                    { color: entr.type == 'Ganhos' ? '#136065' : '#CC3728'}
                                ]}> 
                                R$ 0,00 
                                </Text>
                            }
                            <Text style={styles.dateText}>
                                {entr.day}/{Functions.convertDtToStringMonth(month)}
                            </Text>
                        </>
                        :
                            <View style={styles.censoredValue}/>
                        }
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height:161,
        marginHorizontal: 26,
        marginTop:28,
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
        color: '#3C93F9',
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
    }
})