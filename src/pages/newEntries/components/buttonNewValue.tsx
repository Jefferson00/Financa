import React, {useContext, useEffect, useState} from "react"
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity } from 'react-native'

import Functions from '../../../utils'

import { Feather } from '@expo/vector-icons'


import ValuesDB from '../../../services/valuesDB'
import { StylesContext } from "../../../contexts/stylesContext"
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import entriesDB from "../../../services/entriesDB"
import { MainContext } from "../../../contexts/mainContext"
import { DataBDContext } from "../../../contexts/dataBDContext"

interface ValuesData{
    id:number,
    description: string,
    amount: number,
    monthly: boolean,
    frequency: number,
    entries_id: number,
    dtStart:number,
}

interface EntriesData{
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
}


export default function ButtonNewValue() {

    
    const [contPlusButtonPressed, setContPlusButtonPressed] = useState(0)
    const [hasResults, setHasResults] = useState(false)

    const {entriePrimaryColor, entrieSecondaryColor, showValuesForm, isValuesFormVisible} = useContext(StylesContext)
    const {addNewValueBeforeCreate, entrieIdUpdate} = useContext(NewEntriesContext)
    const {selectedMonth} = useContext(MainContext)
    const {entriesByDate} = useContext(DataBDContext)

    //define dtStart of initalValue
    const dtStart = Functions.setDtStart(new Date())
    const newValue: ValuesData = {
        id:0,
        description: '',
        amount: 0,
        monthly: false,
        frequency: 1,
        entries_id: 0,
        dtStart:dtStart,
    }

    const entrie = entriesByDate.filter(entrie => entrie.id == entrieIdUpdate)
    
    useEffect(()=>{
        //console.log(entrie[0])

        entrie.length > 0 || entrieIdUpdate == 0 ? setHasResults(true) : setHasResults(false)

        if(entrieIdUpdate != 0) setContPlusButtonPressed(1) 
       
        //console.log("Has results: "+hasResults)
    },[entrie])

    return (
        <View style={styles.newValuesView}>
            {isValuesFormVisible ?
                <Text style={[styles.newValuesText, { color: entriePrimaryColor }]}>
                    Adcionar Novos Valores
                </Text>
            :
                <Text style={[styles.newValuesText, { color: entriePrimaryColor }]}>
                   Detalhes
                </Text>
            }
            <TouchableOpacity style={[styles.plusButtonModal, { borderColor: entrieSecondaryColor }]}
                onPress={() => {
                    showValuesForm()
                    setContPlusButtonPressed(contPlusButtonPressed + 1)
                    if (contPlusButtonPressed > 0){
                        hasResults && addNewValueBeforeCreate(newValue)
                    }
                }}>
                {isValuesFormVisible ?
                    <Feather name='plus' size={40} color={entriePrimaryColor} />
                    :
                    <Feather name='chevron-down' size={40} color={entriePrimaryColor} />
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    newValuesView: {
        alignItems: "center",
        //paddingVertical: 19,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    newValuesText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
    plusButtonModal: {
        borderRadius: 10,
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#1A8289',
        justifyContent: 'center',
        alignItems: 'center'
    },

})