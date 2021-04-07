
import React, { useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Alert} from 'react-native';
import NumberFormat from 'react-number-format';
import { Feather, Ionicons } from '@expo/vector-icons'
import { StylesContext } from '../../../contexts/stylesContext';
import { DataBDContext } from '../../../contexts/dataBDContext';
import { MainContext } from '../../../contexts/mainContext';

import Functions from "../../../utils"
import { NewEntriesContext } from '../../../contexts/newEntriesContext';
import functions from '../../../functions';
import { useNavigation } from '@react-navigation/native';

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
    const navigation = useNavigation()

    const {
        isEntriesModalVisible,
        entriePrimaryColor, 
        selectedEntrieId, 
        selectedEntrieTotalValues,
        entrieSecondaryColor,
        textAlertModal,
        textModal,
        colorScheme,
        isDarkTheme,
        updateEntriesModalVisible,
        resetSelectedEntrieId,
    } = useContext(StylesContext)

    const {allEntries, entriesValuesByDate, updateLoadAction} = useContext(DataBDContext)
    const {todayDate, selectedMonth, currentMonth, selectedYear, currentYear} = useContext(MainContext)
    const {handleDeleteEntrie, handleDeleteEntrieValues, updateEntrieReceived, updateEntrieIdUpdate, typeOfEntrie} = useContext(NewEntriesContext)

    const entrieModal = allEntries.filter(entrie => entrie.id == selectedEntrieId)

    console.log("selectedEntrieId "+selectedEntrieId)
    console.log("entrieModal "+entrieModal[0])

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

    function handleToUpdate(){
        updateEntrieIdUpdate(selectedEntrieId)
        updateEntriesModalVisible()
        navigation.navigate('NewEntries', { item: typeOfEntrie})
    }

    return (
        <Modal animationType="slide" visible={isEntriesModalVisible} transparent>
            <View style={styles.modalContainer}>
               <View style={[styles.modalContent, (colorScheme == 'dark' || isDarkTheme) && {backgroundColor:'#181818'}]}>
                    <View style={[styles.headerModal, (colorScheme == 'dark' || isDarkTheme) && {backgroundColor:'#2C2C2C'}]}>
                        <TouchableOpacity onPress={handleToUpdate}>
                            <Feather 
                            name="edit-2" 
                            size={30} 
                            color={isDarkTheme || colorScheme == 'dark' ? "#FFFFFF" : entriePrimaryColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal}>
                            <Feather 
                            name="x" 
                            size={30} 
                            color={isDarkTheme || colorScheme == 'dark' ? "#FFFFFF" : entriePrimaryColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <View style={styles.something}>
                            <View style={styles.tittleView}>
                                <Text style={[styles.tittleText, { color: entriePrimaryColor }]}>
                                    {entrieModal[0].title}
                                </Text>
                                <TouchableOpacity onPress={()=> removeEntrie(entrieModal[0].id)}>
                                    <Feather name="trash-2" size={20} color={entrieSecondaryColor} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tittleView}>
                                <NumberFormat
                                    value={selectedEntrieTotalValues}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    format={Functions.currencyFormatter}
                                    renderText={value => 
                                        <Text style={[styles.subTittleText, { color: entriePrimaryColor },
                                            (colorScheme == 'dark' || isDarkTheme) && {color:'#FFFFFF'}
                                        ]}>
                                             {value} 
                                        </Text>}
                                />
                                <Text style={[styles.subTittleText, { color: entriePrimaryColor },
                                    (colorScheme == 'dark' || isDarkTheme) && {color:'#FFFFFF'}
                                ]}>
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
                                                <Text numberOfLines={1} style={[styles.valuesListText, { color: entriePrimaryColor, marginRight: 5, maxWidth:200 }]}>
                                                     {value.description == '' ? entrieModal[0].title : value.description}
                                                </Text>
                                                <Text style={[styles.valuesListText, { color: entrieSecondaryColor }]}>
                                                    {value.dtEnd != 209912 && "("+frequencyController(value.dtEnd, value.dtStart)+")"}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>
                                                <NumberFormat
                                                    value={value.amount}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    format={Functions.currencyFormatter}
                                                    renderText={value => 
                                                        <Text style={[styles.valuesListText, { color: entriePrimaryColor },
                                                            (colorScheme == 'dark' || isDarkTheme) && {color:'#FFFFFF'}
                                                        ]}> 
                                                            {value} 
                                                        </Text>}
                                                />
                                                <TouchableOpacity onPress={()=> removeValue(value.id)} style={{marginLeft:10}}>
                                                    <Feather name="trash-2" size={20} color={entrieSecondaryColor} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                     )
                                 }
                             })}           
                        </ScrollView>
                    </View>

                    {!entrieModal[0].received && selectedMonth == currentMonth && selectedYear == currentYear &&
                    <>
                    <View style={[{marginBottom:50, marginHorizontal:20, borderRadius:20, padding:20},
                        (isDarkTheme || colorScheme == 'dark') && {backgroundColor:'#454545'}
                    ]}>
                            <View>
                                {isLate &&
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Ionicons name="alert-circle" size={40} color={entriePrimaryColor}/>
                                        <Text style={[styles.tittleText, { color: entrieSecondaryColor , marginLeft:5},
                                        (isDarkTheme || colorScheme == 'dark') && {color:"#FFFFFF"}
                                        ]}>
                                            {textAlertModal}
                                        </Text>
                                    </View>
                                }
                                    <Text style={[styles.subTittleText, { color: entriePrimaryColor , marginTop:15},
                                       (isDarkTheme || colorScheme == 'dark') && {color:"#FFFFFF"}
                                    ]}>
                                          {textModal}
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
                    </View>
                    </>
                    }
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