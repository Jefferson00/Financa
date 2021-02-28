import React from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { MaterialIcons,  Ionicons } from '@expo/vector-icons'

import Functions from '../../../functions/index'
import NumberFormat from 'react-number-format';


export default function EntriesResults(){

    return(
        <View style={{ flex: 1, height: '100%' }}>
        <ScrollView style={styles.scrollViewContainer}>
           
                    <View>
                        <TouchableOpacity
                        style={[styles.earningsItemView]}
                        >
                        <MaterialIcons name="monetization-on" size={40} color={'#d2d2d2'} />

                        <View style={styles.earningTextView}>
                            <Text numberOfLines={1} style={[styles.earningTittleText]}>

                            </Text>
                            <Text style={[styles.earningDateText]}>
                              
                            </Text>
                        </View>

                        <NumberFormat
                            value={4000}
                            displayType={'text'}
                            thousandSeparator={true}
                            format={Functions.currencyFormatter}
                            renderText={value => <Text style={[styles.earningTittleText]}> {value} </Text>}
                        />

                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.earningsItemView]}

                        >
                        <MaterialIcons name="monetization-on" size={40} color={"#d2d2d2"} />

                        
                        <View style={styles.earningTextView}>
                            <Text numberOfLines={1} style={[styles.earningTittleText]}>
                                 
                            </Text>
                            <Text style={[styles.earningDateText]}>
                                 
                            </Text>
                        </View>

                        <NumberFormat
                            value={5000}
                            displayType={'text'}
                            thousandSeparator={true}
                            format={Functions.currencyFormatter}
                            renderText={value => <Text style={[styles.earningTittleText]}> {value} </Text>}
                        />

                    </TouchableOpacity>

                    
 
                    <Ionicons name="alert-circle" size={40} color={"#d2d2d2"} style={styles.alertSign}/>
      
                    </View>

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
