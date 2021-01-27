
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal} from 'react-native';
import NumberFormat from 'react-number-format';
import { Feather, Ionicons } from '@expo/vector-icons'

import {useStylesStates} from '../../../contexts/stylesStates'
import {useSelectedMonthAndYear} from '../../../contexts/selectMonthAndYear'
import {useResultsDB} from '../../../contexts/resultsDBStates'

import {EntriesValues} from "../../../interfaces"

import Functions from '../../../functions/index'

export default function ModalContent({props}:{props:any}) {

    const {setModalVisible, modalVisible, colorText, colorBorderAddButton, textAlert, textReceived } = useStylesStates()
    const {entries, valuesList} = useResultsDB()
    const {selectedMonth, selectedYear, selectedTotalValues} = useSelectedMonthAndYear()

    let rec
    let atrasado = false



    return (
        <Modal animationType="slide" visible={modalVisible} transparent>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                        {entries.map((entrie:EntriesValues, index:number) => {
                            if (entrie.id == props.selectedId){
                                rec = entrie.received
                                //console.log('Recebido: '+rec)
                            if (entrie.day <= props.todayDate.getDate() && !entrie.received){
                                atrasado = true
                            }
                            if (selectedMonth != props.CurrentMonth || selectedYear != props.CurrentYear){
                                atrasado = false
                            }
                            }
                            if (entrie.id == props.selectedId) {
                                return (
                                    <View key={index}>
                                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(26, 130, 137, 0.33)', paddingBottom: 17, marginBottom: 37 }}>
                                            <View style={styles.tittleView}>
                                                <Text style={[styles.tittleText, { color: colorText }]}>
                                                    {entrie.title}
                                                </Text>
                                                <TouchableOpacity onPress={() => props.removeItem(entrie.id)}>
                                                    <Feather name="trash-2" size={20} color={colorText} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.tittleView}>
                                                <NumberFormat
                                                    value={selectedTotalValues}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    format={Functions.currencyFormatter}
                                                    renderText={value => <Text style={[styles.subTittleText, { color: colorText }]}> {value} </Text>}
                                                />

                                                <Text style={[styles.subTittleText, { color: colorText }]}>
                                                    {entrie.day} {Functions.convertDtToStringMonth(selectedMonth)}
                                                </Text>
                                            </View>
                                        </View>
                                        <ScrollView style={{
                                            maxHeight:200,
                                        }}>
                                        {valuesList.map((value:any, index:number) => {
                                            props.currentDate.setMonth(selectedMonth - 1)
                                            props.currentDate.setFullYear(selectedYear)
                                            if (entrie.id == value.entries_id)
                                                return (
                                                    
                                                        <View style={styles.valuesList} key={index}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            {value.description==''?
                                                            <Text style={[styles.valuesListText, { color: colorText, marginRight: 5 }]}>
                                                                {entrie.title}
                                                            </Text>
                                                            :
                                                            <Text style={[styles.valuesListText, { color: colorText, marginRight: 5 }]}>
                                                                {value.description}
                                                            </Text>
                                                            }
                                                            <Text style={[styles.valuesListText, { color: colorBorderAddButton }]}>
                                                                {value.dtEnd != 209912 ? 
                                                                Functions.toFrequency(value.dtEnd, value.dtStart) - Functions.toFrequency(value.dtEnd, Functions.setDtStart(props.currentDate)) + 1 + "/" + (Functions.toFrequency(value.dtEnd, value.dtStart)+1)
                                                                : null}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <NumberFormat
                                                                value={value.amount}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                format={Functions.currencyFormatter}
                                                                renderText={value => <Text style={[styles.valuesListText, { color: colorText }]}> {value} </Text>}
                                                            />
                                                            <TouchableOpacity onPress={() => props.removeValue(value.id)}>
                                                                <Feather name="trash-2" size={20} color={colorBorderAddButton} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        </View>
                                                    
                                                )
                                        })}
                                        </ScrollView>
                                    </View>
                                )
                            }
                        })}


                        <View>
                            {rec == 0 && selectedMonth == props.CurrentMonth && selectedYear == props.CurrentYear ?
                                <>
                                    <View style={{ paddingHorizontal: 26 ,marginTop:32}}>
                                        {atrasado ? 
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Ionicons name="alert-circle" size={40} color={colorText}/>
                                                <Text style={[styles.tittleText, { color: colorBorderAddButton , marginLeft:5}]}>
                                                    {textAlert}
                                                </Text> 
                                            </View>
                                        : null}
                                        <Text style={[styles.subTittleText, { color: colorText , marginTop:15}]}>
                                            {textReceived}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                            <TouchableOpacity onPress={() => props.updateReceived(props.selectedId)}>
                                                <Text style={[styles.tittleText, { color: colorBorderAddButton }]}>
                                                    SIM
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                                <Text style={[styles.tittleText, { color: colorBorderAddButton }]}>
                                                    Ainda não
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                                :
                                <Text></Text>
                            }
                        </View>



                        <View style={styles.footerModal}>
                            <TouchableOpacity onPress={() => { props.handleNavigateNovoUpdate(props.selectedId) }}>
                                <Feather name="edit-2" size={30} color={colorText} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                <Feather name="x" size={30} color={colorText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: ' rgba(0, 0, 0, 0.39);',
        justifyContent: 'center'
      },
      modalContent: {
        backgroundColor: '#fff',
        height: '80%',
        paddingTop: 30,
    },
      footerModal: {
        height: 75,
        borderTopWidth: 1,
        borderTopColor: '#1A828922',
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 26,
        position: 'absolute',
        bottom: 0,
    },
    tittleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 26,
    },
    tittleText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
    subTittleText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    valuesList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 26,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4',
        padding: 5,
        flexWrap: 'wrap'
    },
    valuesListText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
})