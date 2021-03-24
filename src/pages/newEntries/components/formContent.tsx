import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'
import { NewEntriesContext } from "../../../contexts/newEntriesContext";
import { StylesContext } from "../../../contexts/stylesContext";
import entriesDB from "../../../services/entriesDB";
import valuesDB from "../../../services/valuesDB";
import { DataBDContext } from "../../../contexts/dataBDContext";
import LoaderUpdate from "./loaderUpdate";

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


export default function FormContent() {

    const {showCalendar,
           calendarDate, 
           titleInputEntrie,
           isEnabledReceived,
           isEnabledMonthly,
           entrieFrequency,
           entrieValuesBeforeCreate,
           typeOfEntrie,
           onChangeDate, 
           showDatepicker,
           setTitleInputEntrie,
           toggleSwitchReceived,
           toggleSwitchMonthly,
           increaseEntrieFrequency,
           decreaseEntrieFrequency,
           updateEntrieValuesBeforeCreate,
           setEntrieValuesUpdate,
           entrieIdUpdate,
           setValuesUpdate,
        } = useContext(NewEntriesContext)

        const {entriePrimaryColor, entrieSecondaryColor , isValuesFormVisible} = useContext(StylesContext)
        const {entriesValuesByDate} = useContext(DataBDContext)

        const [loadingActive, setLoadingActive] = useState(false)

    useEffect(()=>{
        if (entrieIdUpdate != 0){
            setLoadingActive(true)
            entriesDB.findById(entrieIdUpdate).then((res:any)=>{
                setEntrieValuesUpdate(res._array[0])
                setLoadingActive(false)
            }).catch(err=>{
                console.log(err)
            })

            let entrieUpdate = entriesValuesByDate.filter((vlr: EntriesValuesData) => vlr.entries_id == entrieIdUpdate)
            console.log("Entrie Update: "+entrieUpdate)
            setValuesUpdate(entrieUpdate)
            
        }
    },[])

    return (
        <>
            {loadingActive ?
                <LoaderUpdate/>
            :
                <>
                    <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                        Título
                    </Text>
                    <TextInput
                        onChangeText={text => setTitleInputEntrie(text)}
                        value={titleInputEntrie}
                        style={styles.InputText}
                        maxLength={30}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                {typeOfEntrie == "Ganhos" ?"Data de recebimento" : "Data de pagamento"}
                            </Text>
                            <View style={styles.dateView}>
                                <Text style={[styles.tinyText, { color: entrieSecondaryColor }]} onPress={showDatepicker}>
                                    {calendarDate.getDate()} / {Functions.convertDtToStringMonth(calendarDate.getMonth() + 1)}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                {typeOfEntrie == "Ganhos" ?"Recebido" : "Pago"}
                            </Text>
                            <Switch
                                trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                                thumbColor={isEnabledReceived ? 'd2d2d2' : entriePrimaryColor}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchReceived}
                                value={isEnabledReceived}
                                style={{marginTop: 15}}
                            />
                        </View>
                    </View>
                    {showCalendar &&
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={calendarDate}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    }

                    <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                        Periodicidade
                    </Text>

                    <View style={styles.frequencyView}>
                        <Text style={[styles.tinyText, { color: entrieSecondaryColor }]}>
                            Mensal
                        </Text>
                        <Switch
                            trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                            thumbColor={isEnabledMonthly ? 'd2d2d2' : entriePrimaryColor}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchMonthly}
                            value={isEnabledMonthly}
                        />

                        <Feather name='chevron-left' size={30}
                            onPress={decreaseEntrieFrequency} />

                        <Text style={{ fontSize: 18 }}>
                            {isEnabledMonthly? '-' : entrieFrequency}
                        </Text>

                        <Feather name='chevron-right' size={30}
                            onPress={increaseEntrieFrequency}
                        />
                        <Text style={[styles.tinyText, { color: entrieSecondaryColor }]}>
                            Vezes
                        </Text>
                    </View>

                    <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                        Valor
                    </Text>
                    {!isValuesFormVisible && 
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.tinyText, { color: entrieSecondaryColor, marginRight: 10, fontSize: 18 }]}>
                                R$
                            </Text>
                            <TextInput
                                keyboardType='numeric'
                                style={styles.InputTextValue}
                                onChange={e => updateEntrieValuesBeforeCreate('amount', 0 , e)}
                                value={entrieValuesBeforeCreate[0].amount.toString()}
                            />
                        </View>
                    }
                </>
            }


        </>
    )
}

const styles = StyleSheet.create({
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        marginTop: 10,
    },
    dateView: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        width: 80,
        minHeight:40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        flexDirection: 'row',
        marginTop: 15
    },
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    tinyText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    InputText: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#d2d2d2',
        color: '#136065',
    },
    InputTextValue: {
        height: 40,
        color: '#136065',
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        width: '100%'
    },
})