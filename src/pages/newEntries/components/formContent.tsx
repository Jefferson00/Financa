import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

import Functions from '../../../functions'

import { Feather, Ionicons , FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { NewEntriesContext } from "../../../contexts/newEntriesContext";
import { StylesContext } from "../../../contexts/stylesContext";
import entriesDB from "../../../services/entriesDB";
import valuesDB from "../../../services/valuesDB";
import { DataBDContext } from "../../../contexts/dataBDContext";
import LoaderUpdate from "./loaderUpdate";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

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
           entrieIdUpdate,
           typeOfEntrie,
           entrieCategory,
           onChangeDate, 
           showDatepicker,
           setTitleInputEntrie,
           toggleSwitchReceived,
           toggleSwitchMonthly,
           increaseEntrieFrequency,
           decreaseEntrieFrequency,
           updateEntrieValuesBeforeCreate,
           setEntrieValuesUpdate,
           setValuesUpdate,
           updateEntrieCategory,
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
            
        }else{
            updateEntrieCategory('others')
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
                                {entrieIdUpdate == 0 ?
                                    typeOfEntrie == "Ganhos" ?"Data de recebimento" : "Data de pagamento"
                                :
                                    "Data de Início"
                                }
                            </Text>
                            <View style={styles.dateView}>
                                <TouchableOpacity  onPress={showDatepicker} hitSlop={styles.hitSlop}>
                                    <Text style={[styles.tinyText, { color: entrieSecondaryColor }]}>
                                        {calendarDate.getDate()} / {Functions.convertDtToStringMonth(calendarDate.getMonth() + 1)}
                                    </Text>
                                </TouchableOpacity>
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

                        <TouchableOpacity onPress={decreaseEntrieFrequency} hitSlop={styles.hitSlop}>
                            <Feather name='chevron-left' size={30}/>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 18 }}>
                            {isEnabledMonthly? '-' : entrieFrequency}
                        </Text>

                        <TouchableOpacity onPress={increaseEntrieFrequency} hitSlop={styles.hitSlop}>
                            <Feather name='chevron-right' size={30}/>
                        </TouchableOpacity>
                        <Text style={[styles.tinyText, { color: entrieSecondaryColor }]}>
                            Vezes
                        </Text>
                    </View>

                    <Text style={[styles.subTittleText, { color: entriePrimaryColor, marginTop:10 }]}>
                        Categoria
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{flexDirection:'row'}}>
                            {typeOfEntrie == "Ganhos" &&
                                <View style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("pay")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <FontAwesome5 
                                            name="money-bill-wave" 
                                            size={24} 
                                            color={entrieSecondaryColor} 
                                            style={entrieCategory == 'pay' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Salário
                                    </Text>
                                </View>
                            }
                            <View style={styles.categoryView}>
                                <TouchableOpacity 
                                    style={{margin:10}}
                                    onPress={()=> updateEntrieCategory("food")}
                                    hitSlop={styles.hitSlop}
                                >
                                    <Ionicons 
                                        name="restaurant" 
                                        size={24} 
                                        color={entrieSecondaryColor} 
                                        style={entrieCategory == 'food' ? {opacity:1}: {opacity:0.3}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                    Alimentação
                                </Text>
                            </View>
                            <View  style={styles.categoryView}>
                                <TouchableOpacity 
                                    style={{margin:10}} 
                                    onPress={()=> updateEntrieCategory("house")}
                                    hitSlop={styles.hitSlop}
                                >
                                    <Ionicons 
                                        name="home" 
                                        size={24} 
                                        color={entrieSecondaryColor} 
                                        style={entrieCategory == 'house' ? {opacity:1}: {opacity:0.3}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                    Casa
                                </Text>
                            </View>
                            <View  style={styles.categoryView}>
                                <TouchableOpacity 
                                    style={{margin:10}}
                                    onPress={()=> updateEntrieCategory("transport")}
                                    hitSlop={styles.hitSlop}
                                >
                                    <Ionicons 
                                        name="bus" 
                                        size={24} 
                                        color={entrieSecondaryColor} 
                                        style={entrieCategory == 'transport' ? {opacity:1}: {opacity:0.3}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                    Transporte
                                </Text>
                            </View>
                            <View  style={styles.categoryView}>
                                <TouchableOpacity 
                                    style={{margin:10}} 
                                    onPress={()=> updateEntrieCategory("transfer")}
                                    hitSlop={styles.hitSlop}
                                >
                                    <MaterialCommunityIcons 
                                        name="bank-transfer" 
                                        size={24} 
                                        color={entrieSecondaryColor} 
                                        style={entrieCategory == 'transfer' ? {opacity:1}: {opacity:0.3}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                    Transferencias
                                </Text>
                            </View>
                            {typeOfEntrie == "Despesas" &&
                            <>
                                <View  style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("card")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <Ionicons 
                                            name="card-outline" 
                                            size={24} 
                                            color={entrieSecondaryColor} 
                                            style={entrieCategory == 'card' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Cartão de crédito
                                    </Text>
                                </View>
                                <View  style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("education")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <Ionicons 
                                            name="school" 
                                            size={24} 
                                            color={entrieSecondaryColor} 
                                            style={entrieCategory == 'education' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Educação
                                    </Text>
                                </View>
                                <View  style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("recreation")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <FontAwesome5 
                                            name="theater-masks" 
                                            size={24} 
                                            color={entrieSecondaryColor} 
                                            style={entrieCategory == 'recreation' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Lazer
                                    </Text>
                                </View>
                                <View  style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("comunication")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <FontAwesome5 
                                            name="phone" 
                                            size={24} 
                                            color={entrieSecondaryColor} 
                                            style={entrieCategory == 'comunication' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Comunicação
                                    </Text>
                                </View>
                                <View  style={styles.categoryView}>
                                    <TouchableOpacity 
                                        style={{margin:10}} 
                                        onPress={()=> updateEntrieCategory("health")}
                                        hitSlop={styles.hitSlop}
                                    >
                                        <AntDesign 
                                        name="medicinebox" 
                                        size={24} color={entrieSecondaryColor} 
                                        style={entrieCategory == 'health' ? {opacity:1}: {opacity:0.3}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                        Saúde
                                    </Text>
                                </View>
                            </>
                            }
                            <View  style={styles.categoryView}>
                                <TouchableOpacity 
                                    style={{margin:10}} 
                                    onPress={()=> updateEntrieCategory("others")}
                                    hitSlop={styles.hitSlop}
                                >
                                    <Ionicons 
                                        name="cash-outline" 
                                        size={24} 
                                        color={entrieSecondaryColor} 
                                        style={entrieCategory == 'others' ? {opacity:1}: {opacity:0.3}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.tinyText, {color:entrieSecondaryColor}]}>
                                    Outros
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

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
        marginTop: 15,
        borderRadius:5,
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
    categoryView:{
        alignItems:'center', 
        justifyContent:'center',
        margin:10
    },
    hitSlop:{
        top:20,
        bottom:20,
        left:30,
        right:30,
    },
})