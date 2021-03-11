
import React, { useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Alert} from 'react-native';
import NumberFormat from 'react-number-format';
import { Feather, Ionicons } from '@expo/vector-icons'
import { StylesContext } from '../../../contexts/stylesContext';
import { DataBDContext } from '../../../contexts/dataBDContext';
import { MainContext } from '../../../contexts/mainContext';

import Functions from "../../../utils"
import { NewEntriesContext } from '../../../contexts/newEntriesContext';

interface EntriesValuesData{
    id:number,
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
}


export default function ModalContent() {
    let rec
    let isLate = false

    const {
        isEntriesModalVisible,
        entriePrimaryColor, 
        selectedEntrieId, 
        selectedEntrieTotalValues,
        entrieSecondaryColor,
        updateEntriesModalVisible,
        resetSelectedEntrieId,
    } = useContext(StylesContext)
    const {entriesByDate, entriesValuesByDate, updateLoadAction} = useContext(DataBDContext)
    const {todayDate, selectedMonth, currentMonth, selectedYear, currentYear} = useContext(MainContext)
    const {handleDeleteEntrie, handleDeleteEntrieValues, updateEntrieReceived} = useContext(NewEntriesContext)

    const entrieModal = entriesByDate.filter(entrie => entrie.id == selectedEntrieId)

    if(entrieModal !=undefined){
        if (entrieModal[0].day <= todayDate.getDate() && !entrieModal[0].received){
            isLate = true 
        }
    }

    function frequencyController(dtEnd: number, dtStart: number){
        const newDate = new Date()
        newDate.setMonth(selectedMonth-1)
        newDate.setFullYear(selectedYear)
        return Functions.toFrequency(dtEnd, dtStart) - Functions.toFrequency(dtEnd, Functions.setDtStart(newDate)) + 1 + "/" + (Functions.toFrequency(dtEnd, dtStart)+1)
    }

    function removeEntrie(entrieId: number) {
        Alert.alert(
            "Remover",
            "Deseja mesmo remover?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        handleDeleteEntrie(entrieId)
                        resetSelectedEntrieId()
                        updateLoadAction()
                    }
                }
            ],
            { cancelable: false }
        );
    }

    function removeValue(valueId: number) {
        Alert.alert(
            "Remover",
            "Deseja mesmo remover?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                       handleDeleteEntrieValues(-1, valueId)
                    }
                }
            ],
            { cancelable: false }
        );
    }

    function closeModal(){
        resetSelectedEntrieId()
        updateEntriesModalVisible()
    }

    return (
        <Modal animationType="slide" visible={isEntriesModalVisible} transparent>
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                    <View style={styles.headerModal}>
                        <TouchableOpacity>
                            <Feather name="edit-2" size={30} color={entriePrimaryColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal}>
                            <Feather name="x" size={30} color={entriePrimaryColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <View style={styles.something}>
                            <View style={styles.tittleView}>
                                <Text style={[styles.tittleText, { color: entriePrimaryColor }]}>
                                    {entrieModal[0].title}
                                </Text>
                                <TouchableOpacity onPress={()=> removeEntrie(entrieModal[0].id)}>
                                    <Feather name="trash-2" size={20} color={entriePrimaryColor} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tittleView}>
                                <NumberFormat
                                    value={selectedEntrieTotalValues}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    format={Functions.currencyFormatter}
                                    renderText={value => 
                                        <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                             {value} 
                                        </Text>}
                                />
                                <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                    {entrieModal[0].day} {Functions.convertDtToStringMonth(selectedMonth)}
                                </Text>
                            </View>

                        </View>

                        <ScrollView style={{maxHeight:200}}>
                             {entriesValuesByDate.map((value:EntriesValuesData, index:number) =>{
                                 if (value.entries_id == selectedEntrieId){
                                     return (
                                        <View style={styles.valuesList} key={index}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.valuesListText, { color: entriePrimaryColor, marginRight: 5 }]}>
                                                     {value.description == '' ? entrieModal[0].title : value.description}
                                                </Text>
                                                <Text style={[styles.valuesListText, { color: entrieSecondaryColor }]}>
                                                    {value.dtEnd != 209912 && frequencyController(value.dtEnd, value.dtStart)}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>
                                                <NumberFormat
                                                    value={value.amount}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    format={Functions.currencyFormatter}
                                                    renderText={value => 
                                                        <Text style={[styles.valuesListText, { color: entriePrimaryColor }]}> 
                                                            {value} 
                                                        </Text>}
                                                />
                                                <TouchableOpacity onPress={()=> removeValue(value.id)}>
                                                    <Feather name="trash-2" size={20} color={entrieSecondaryColor} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                     )
                                 }
                             })}           
                        </ScrollView>
                    </View>

                    <View style={{marginBottom:59}}>
                        {!entrieModal[0].received && selectedMonth == currentMonth && selectedYear == currentYear &&
                        <>
                            <View style={{ paddingHorizontal: 26 ,marginTop:32}}>
                                {isLate &&
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Ionicons name="alert-circle" size={40} color={entriePrimaryColor}/>
                                        <Text style={[styles.tittleText, { color: entrieSecondaryColor , marginLeft:5}]}>
                                            Texto de Alerta
                                        </Text>
                                    </View>
                                }
                                    <Text style={[styles.subTittleText, { color: entriePrimaryColor , marginTop:15}]}>
                                          Texto 
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <TouchableOpacity onPress={()=>updateEntrieReceived(selectedEntrieId)}>
                                            <Text style={[styles.tittleText, { color: entrieSecondaryColor }]}>SIM</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={updateEntriesModalVisible}>
                                            <Text style={[styles.tittleText, { color: entrieSecondaryColor }]}>Ainda não</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        </>
                        }
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
        backgroundColor: '#ffffff',
        height: '80%',
    },
      headerModal: {
        height: 75,
        borderBottomWidth: 1,
        borderBottomColor: '#1A828922',
        width: '100%',
        marginBottom:20,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 26,
        top: 0,
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
        flexWrap: 'wrap',
    },
    valuesListText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
    something:{
        borderBottomWidth: 1, borderBottomColor: 'rgba(26, 130, 137, 0.33)', paddingBottom: 17, marginBottom: 37 
    }
})