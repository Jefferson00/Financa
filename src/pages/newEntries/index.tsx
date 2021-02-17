import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, Platform, KeyboardAvoidingView, Modal, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import Footer from '../components/footer'
import { ScrollView } from 'react-native-gesture-handler';

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB'
import Functions from '../../functions/index'

import Header from "../components/header"
import ButtonSubmit from "./components/button"
import FormContentCreate from "./components/formContentCreate"
import FormContentUpdate from "./components/formContentUpdate"
import ButtonNewValue from "./components/buttonNewValue"
import FormContent from "./components/formContent"
import SuccessModal from "./components/modal"

import LoaderUpdate from "./components/loaderUpdate"

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useStylesStates} from '../../contexts/stylesStates'
import {useResultsDB} from "../../contexts/resultsDBStates"
import {earningValues, ValuesItemUpdate, ValuesItem } from '../../interfaces';

export default function NewEntries({ route }: { route: any }, { navigation }: { navigation: any }) {

    const { item } = route.params
    const { idUpdate } = route.params
    const nav = useNavigation()

    const {
        selectedMonth, 
        selectedYear,  
    } = useSelectedMonthAndYear();
    const {  
        mainColor1,
        mainColor2,
        setColorBorderAddButton,
        setMainColor1,
        setMainColor2,
        tittleTextColor,
        setTittleTextColor,
        setMonthColor,
        valueTitle, onChangeTitle,
        setReceivedTextDate,
        setReceivedText,
        setSubtittleTextColor
    } = useStylesStates();
    const {valueFrequency, 
            setValueFrequency, 
            valuesArray, 
            setValuesArray, 
            valuesUpdate, 
            setValuesUpdate, 
            setFrequencys, 
            setEntries, 
            entries
        }  = useResultsDB();
 

    /*Estados de aparencia*/

    /**/ const [tittleText, setTittleText] = useState('')

    /*Estados de valores*/
    /**/ const [showValues, setShowValues] = useState(false)
    const [earning, setEarning] = useState<earningValues[]>([])
    const [valuesBeforeUpdate, setValuesBeforeUpdate] = useState<ValuesItemUpdate[]>([])

    const todayDate = new Date()
    const selectedDate = todayDate

    
    /*Outros Estados*/
    /**/ const [successModal, setSuccessModal] = useState(false)
    const [done, setDone] = useState(false)


    //Switch control monthly
    const [show, setShow] = useState(false);

    const [switchMonthlyisEnabled, setSwitchMonthlyIsEnabled] = useState(false);

    const toggleSwitchMonthly = () => {
        //seta o switch mensal como true ou false
        setSwitchMonthlyIsEnabled(previousState => !previousState)
        updateOneValue('monthly', 0, !switchMonthlyisEnabled)
        if (!switchMonthlyisEnabled) {
            let newArr = valuesUpdate.map((item:ValuesItemUpdate, i:number) => {
                if (i == 0) {
                    return { ...item, ['dtEnd']: 209912 }
                } else {
                    return item
                }
            })
            setValuesUpdate(newArr)
        }
    };

    //Switch control Recebido
    const [isEnabledReceived, setIsEnabledReceived] = useState(false);

    const toggleSwitchReceived = () => setIsEnabledReceived(previousState => !previousState);

    //Calendar function
    const [date, setDate] = useState(new Date());

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

     // funções de navegação
    function handleNavigateEntries() {
        resetValues()
        
        nav.goBack()
        setSuccessModal(false)
    }

    function resetValues(){
        setEntries([])
        onChangeTitle()
        setValueFrequency(1)
        let arr = [{id: 1, description: '', amount: '0', monthly: false, repeat: 1}]
        setValuesArray(arr)
        setSwitchMonthlyIsEnabled(false)
        setIsEnabledReceived(false)
    }


    /*Atualiza os valores dos inputs 'valores' */

    const updateValues = (subitem: any, index: any, value: any) => (e: any) => {
        let newArr = valuesArray.map((item:ValuesItem, i:number) => {
            if (index == i) {
                if (subitem == 'monthly') {
                    return { ...item, [subitem]: value = !value }
                }
                else if (subitem == 'amount') {
                    var valor = e.nativeEvent.text
                    valor = valor + '';
                    valor = parseInt(valor.replace(/[\D]+/g, ''));
                    valor = valor + '';
                    valor = valor.replace(/([0-9]{2})$/g, ",$1");
                    if (valor.length > 6) {
                        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
                    }
                    if (valor =="NaN") valor = 0
                    return { ...item, [subitem]: valor }
                }
                else {
                    return { ...item, [subitem]: e.nativeEvent.text }
                }
            } else {
                return item
            }
        })
        setValuesArray(newArr)
    }

    const updateValuesUpdate = (subitem: any, index: any, value: any) => (e: any) => {
        let newArr = valuesUpdate.map((item:ValuesItemUpdate, i:number) => {
            if (index == i) {
                if (subitem == 'monthly') {
                    //console.log(value)
                    var fr = 0
                    if (!value[0]) {
                        fr = value[1]
                        return { ...item, ['dtEnd']: 209912 }
                    } else {
                        var dt = new Date()
                        var dtEnd = Functions.setDtEnd(false, fr, dt)
                        //console.log(dtEnd)
                        return { ...item, ['dtEnd']: dtEnd }
                    }
                }
                else if (subitem == 'repeat') {
                    var dt = new Date()
                    var rpt = value[1]
                    var dtEnd = Functions.setDtEnd(value[0], rpt, dt)
                    return { ...item, ['dtEnd']: dtEnd }

                }
                else if (subitem == 'amount') {
                    var valor = e.nativeEvent.text
                    valor = valor + '';
                    valor = parseInt(valor.replace(/[\D]+/g, ''));
                    valor = valor + '';
                    valor = valor.replace(/([0-9]{2})$/g, ",$1");

                    if (valor.length > 6) {
                        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
                    }
                    if (valor =="NaN") valor = 0
                    return { ...item, [subitem]: valor }
                }
                else {
                    return { ...item, [subitem]: e.nativeEvent.text }
                }
            } else {
                return item
            }
        })
        setValuesUpdate(newArr)
    }

    const updateFrequencyValuesUpdate = (subitem: any, index: any, value: any) => {
        let newArr: any = valuesUpdate.map((item:ValuesItemUpdate, i:number) => {
            if (index == i) {
                if (subitem == 'repeat') {
                    var dt = new Date()
                    /*var dat = Functions.toMonthAndYear(item.dtStart)
                    console.log('mes: ' + dat.month)
                    console.log('ano: ' + dat.year)
                    dt.setMonth(parseInt(dat.month))
                    dt.setFullYear(parseInt(dat.year))*/

                    dt.setMonth(parseInt(Functions.toMonthAndYear(item.dtStart).month) - 1)
                    dt.setFullYear(parseInt(Functions.toMonthAndYear(item.dtStart).year))
                    var rpt = value[1]
                    //console.log('Repetir: ' + rpt)
                    //console.log('Data: ' + dt)
                    var dtEnd = Functions.setDtEnd(value[0], rpt, dt)
                    //console.log('sata fim: ' + dtEnd)
                    return { ...item, ['dtEnd']: dtEnd }

                }

            } else {
                return item
            }
        })
        setValuesUpdate(newArr)
    }

    /*Atualiza os valores da periodicidade */
    const updateOneValue = (subitem: any, index: any, value: any) => {
        let newArr = valuesArray.map((item:ValuesItem, i:number) => {
            if (index == i) {
                if (subitem == 'monthly') {
                    return { ...item, [subitem]: value }
                }
                else {
                    return { ...item, [subitem]: value }
                }
            } else {
                return item
            }
        })
        setValuesArray(newArr)
    }


    function handleCreateNew() {
        let dtStart = Functions.setDtStart(date)
        let dtEnd = Functions.setDtEnd(switchMonthlyisEnabled, valueFrequency, date)
        const GanhoObj = {
            title: valueTitle,
            day: date.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: switchMonthlyisEnabled,
            received: isEnabledReceived,
            type: item
        }
        EntriesDB.create(GanhoObj)


        EntriesDB.all().then((res: any) => {
            //console.log(res)
            valuesArray.map((value:ValuesItem) => {
                var vlr = value.amount
                vlr = vlr.replace(/[.]/g, '')
                vlr = vlr.replace(/[,]/g, '')
                //console.log(vlr)
                const ValueObj = {
                    description: value.description,
                    amount: vlr,
                    dtStart: dtStart,
                    dtEnd: Functions.setDtEnd(value.monthly, value.repeat, date),
                    entries_id: res._array.slice(-1)[0].id
                }

                ValuesDB.create(ValueObj).then(() => {

                }).catch(err => {
                    console.log(err)
                })
                setSuccessModal(true)
            })


        }).catch(err => {
            console.log(err)
        })


    }

   

    function handleUpdate() {
        const dateStart = new Date()
        let entr = entries.filter((ent: any) => ent.id == idUpdate)
      
        dateStart.setMonth(parseInt(Functions.toMonthAndYear(entr[0].dtStart).month)-1)
        dateStart.setFullYear(parseInt(Functions.toMonthAndYear(entr[0].dtStart).year))
        let dtStart = Functions.setDtStart(dateStart)
        
        let dtEnd = Functions.setDtEnd(switchMonthlyisEnabled, valueFrequency, date)
        
        const GanhoObj = {
            title: valueTitle,
            day: date.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: switchMonthlyisEnabled,
            received: isEnabledReceived,
            type: item
        }
        EntriesDB.update(idUpdate, GanhoObj).then(res => {
            valuesUpdate.map((value:ValuesItemUpdate,index:number) => {
                var vlr = value.amount
                //console.log('vlr' + vlr)
                if (typeof (vlr) == 'string') {
                    vlr = vlr.replace(/[.]/g, '')
                    vlr = vlr.replace(/[,]/g, '')
                }

                if (value.dtEnd == 209912 && valuesBeforeUpdate[index] != null) {
                    //console.log('Valor antes: '+valuesBeforeUpdate[index].amount)
                    const newDtStart = new Date()
                   // console.log("dtStart: "+valuesBeforeUpdate[index].dtStart)
                    newDtStart.setMonth(parseInt(Functions.toMonthAndYear(valuesBeforeUpdate[index].dtStart).month)-1)
                    newDtStart.setFullYear(parseInt(Functions.toMonthAndYear(valuesBeforeUpdate[index].dtStart).year))
                    selectedDate.setMonth(selectedMonth-1)
                    selectedDate.setFullYear(selectedYear)
                    let newDtEnd
                    if ((selectedDate.getMonth() + 1) < 10) {
                        newDtEnd = selectedDate.getFullYear().toString() + '0' + (selectedDate.getMonth() + 1).toString()
                    } else {
                        newDtEnd = selectedDate.getFullYear().toString() + (selectedDate.getMonth() + 1).toString()
                    }
                    let contRep = Functions.toFrequency(parseInt(newDtEnd), value.dtStart)
                    if (contRep > 0){
                        //console.log("dtEnd: "+newDtEnd)
                        //console.log("contRep: "+contRep)
                        //console.log("newdtStart: "+newDtStart)
                        const ValueObjMonthly = {
                            description: value.description,
                            amount: valuesBeforeUpdate[index].amount,
                            dtStart: valuesBeforeUpdate[index].dtStart,
                            dtEnd: Functions.setDtEnd(false,contRep,newDtStart),
                            entries_id: idUpdate
                        }
                        ValuesDB.update(value.id, ValueObjMonthly)
                        const newValueObjMonthly = {
                            description: value.description,
                            amount: vlr,
                            dtStart: Functions.setDtStart(selectedDate),
                            dtEnd: Functions.setDtEnd(true,0,newDtStart),
                            entries_id: idUpdate 
                        }
                        ValuesDB.create(newValueObjMonthly)
                    }else{
                        updateNormally(value)
                    }
                }else{
                    updateNormally(value)
                }

            })
            setSuccessModal(true)

            let newDate
            if ((selectedDate.getMonth() + 1) < 10) {
                newDate = selectedDate.getFullYear().toString() + '0' + (selectedDate.getMonth() + 1).toString()
            } else {
                newDate = selectedDate.getFullYear().toString() + (selectedDate.getMonth() + 1).toString()
            }
            ValuesDB.findByDate(parseInt(newDate)).then((res: any) => {
                var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
                setValuesUpdate(arr)
            })

        }).catch(err => {
            console.log(err)
        })
    }

    function updateNormally(value: ValuesItemUpdate){
        var vlr = value.amount
                //console.log('vlr' + vlr)
                if (typeof (vlr) == 'string') {
                    vlr = vlr.replace(/[.]/g, '')
                    vlr = vlr.replace(/[,]/g, '')
                }
        const ValueObj = {
            description: value.description,
            amount: vlr,
            dtStart: value.dtStart,
            dtEnd: value.dtEnd,
            entries_id: idUpdate
        }
        ValuesDB.update(value.id, ValueObj)
    }

    useEffect(() => {

            selectedDate.setMonth(selectedMonth - 1)
            selectedDate.setFullYear(selectedYear)
          
            if (idUpdate == null) {
                date.setMonth(selectedMonth - 1)
                date.setFullYear(selectedYear)
            }
       

        if (item === 'Ganhos') {
            if (nav.isFocused()){
                setMainColor1('#155F69')
                setMainColor2('#F9CF3C')
                setTittleText('Novo Ganho')
                setTittleTextColor('#1A8289')
                setColorBorderAddButton('#24DBBA')
                setMonthColor('#FDDB63')
                setSubtittleTextColor('#49B39F')
                setReceivedText('Recebido')
                setReceivedTextDate('Data de Recebimento')
            }

        } else if (item === 'Despesas') {
            if (nav.isFocused()){
                setMainColor1('#CC3728')
                setMainColor2('#F9CF3C')
                setTittleText('Nova Despesa')
                setTittleTextColor('#CC3728')
                setMonthColor('#FFF')
                setColorBorderAddButton('#FF4835')
                setSubtittleTextColor('#FF4835')
                setReceivedText('Pago')
                setReceivedTextDate('Data de Pagamento')
            }
        }


        if (idUpdate != null) {
            setDone(false)
            let firstDate
            if (selectedMonth < 10) {
                firstDate = selectedYear.toString() + '0' + selectedMonth.toString()
            } else {
                firstDate = selectedYear.toString() + selectedMonth.toString()
            }
            ValuesDB.findByDate(parseInt(firstDate)).then((res: any) => {
                var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
                setValuesUpdate(arr)
                setValuesBeforeUpdate(arr)
            })
            EntriesDB.findById(idUpdate).then((res: any) => {
                setEarning(res._array)
                setDone(true)
            }).catch(err => {
                console.log(err)
            })
        }
        
    }, [])

    function updateValuesList() {
        let firstDate
        if (selectedMonth < 10) {
            firstDate = selectedYear.toString() + '0' + selectedMonth.toString()
        } else {
            firstDate = selectedYear.toString() + selectedMonth.toString()
        }
        ValuesDB.findByDate(parseInt(firstDate)).then((res: any) => {
            var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
            setValuesUpdate([...valuesUpdate, arr[arr.length -1]])
        })
        EntriesDB.findById(idUpdate).then((res: any) => {
            setEarning(res._array)

        }).catch(err => {
            console.log(err)
        })
    }

    function removeValue(id: number) {
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
                    text: "OK", onPress: () =>
                        ValuesDB.remove(id).then(res => {
                            setValuesUpdate(valuesUpdate.filter((vls:ValuesItemUpdate) => vls.id !== id))
                        }).catch(err => {
                            console.log(err)
                        })
                }
            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        if (earning.length > 0) {
            onChangeTitle(earning[0].title)
            if (earning[0].monthly) {
                setSwitchMonthlyIsEnabled(true)
            } else {
                setSwitchMonthlyIsEnabled(false)
                setValueFrequency(Functions.toFrequency(earning[0].dtEnd, earning[0].dtStart) + 1)
            }
            if (earning[0].received) {
                setIsEnabledReceived(true)
            }else{
                setIsEnabledReceived(false)
            }
            date.setMonth(parseInt(Functions.toMonthAndYear(earning[0].dtStart).month)-1)
            date.setDate(earning[0].day)

        }
    }, [earning])

    useEffect(() => {
        setFrequencys([])
        let arrFrequency: any = []
        valuesUpdate.map((value:ValuesItemUpdate) => {
            arrFrequency.push(Functions.toFrequency(value.dtEnd, value.dtStart) + 1)
        })
        setFrequencys(arrFrequency)
    }, [valuesUpdate])


    const props = {
        item,
        idUpdate,
        showValues,
        switchMonthlyisEnabled,
        isEnabledReceived,
        selectedDate,
        date,
        show,
        successModal,
        handleUpdate,
        handleCreateNew,
        toggleSwitchMonthly,
        toggleSwitchReceived,
        onChangeDate,
        updateValues,
        updateFrequencyValuesUpdate,
        removeValue,
        updateValuesUpdate,
        updateValuesList,
        showDatepicker,
        updateOneValue,
        handleNavigateEntries,
        setShowValues
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[mainColor1, mainColor2]} start={{ x: -0.4, y: 0.1 }} style={styles.container}>
                <StatusBar style="light" translucent />
                {/*Mês e ano*/}
                <Header props={props}></Header>

                {/* Main container */}

                <View style={styles.mainContainer}>
                    <View style={styles.tittleTextView}>
                        <Text style={[styles.tittleText, { color: tittleTextColor }]}>
                            {tittleText}
                        </Text>
                    </View>
                    {done || !idUpdate?
                        <>
                        <ScrollView style={{ maxHeight: '100%' }}>
                            <View style={styles.formView}>
                                <FormContent props={props}></FormContent>
    
                                <FormContentCreate props={props}></FormContentCreate>
                                <FormContentUpdate props={props}></FormContentUpdate>
                               
    
                                <ButtonNewValue props={props}></ButtonNewValue>
    
                            </View>
    
                        </ScrollView>
                            <ButtonSubmit props={props}></ButtonSubmit>
                        </>
                        :
                        <LoaderUpdate></LoaderUpdate>
                    }

                    <Footer item={item}></Footer>
                </View>

                <SuccessModal props={props}></SuccessModal>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },
    tittleTextView: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formView: {
        marginHorizontal: 43
    },


    tittleText: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 33,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start',
    },
})

