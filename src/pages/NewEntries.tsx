import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, Button, TextInput, Platform, KeyboardAvoidingView, Modal, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import Footer from './components/footer'
import { ScrollView, Switch } from 'react-native-gesture-handler';

import EntriesDB from '../services/entriesDB'
import ValuesDB from '../services/valuesDB'
import Functions from '../functions/index'

export default function NewEntries({ route }: { route: any }, { navigation }: { navigation: any }) {

    const { item, month, year } = route.params
    const { idUpdate } = route.params
    const nav = useNavigation()

    /*Interfaces*/

    interface ValuesItem {
        id: number,
        description: string,
        amount: string,
        monthly: boolean,
        repeat: number,
    }

    interface ValuesItemUpdate {
        id: number,
        description: string,
        amount: string,
        dtStart: number,
        dtEnd: number,
        entries_id: number,
    }

    interface earningValues {
        title: string,
        day: number,
        dtStart: number,
        dtEnd: number,
        monthly: boolean,
        received: boolean,
    }

    /*Estados de aparencia*/
    /**/ const [mainColor1, setMainColor1] = useState('')
    /**/ const [mainColor2, setMainColor2] = useState('')
    /**/ const [tittleText, setTittleText] = useState('')
    /**/ const [tittleTextColor, setTittleTextColor] = useState('#fff')
    /**/ const [valueTitle, onChangeTitle] = useState('');
    /**/ const [receivedTextDate, setReceivedTextDate] = useState('');
    /**/ const [receivedText, setReceivedText] = useState('');
    /**/ const [colorBorderAddButton, setColorBorderAddButton] = useState('#fff')
    /**/ const [secondColor, setSecondColor] = useState('#fff')
    /**/ const [colorMonth, setColorMonth] = useState('#fff')
    /**/
    /**/

    /*Estados de valores*/
    /**/ const [idValues, setIdValues] = useState(0)
    /**/ const [valueFrequency, setValueFrequency] = useState(1);
    /**/ const [valuesArray, setValuesArray] = useState<ValuesItem[]>([{
        id: 0,
        description: '',
        amount: '0',
        monthly: false,
        repeat: 1
    }])
    /**/ const [showValues, setShowValues] = useState(false)
    const [earning, setEarning] = useState<earningValues[]>([])
    const [valuesUpdate, setValuesUpdate] = useState<ValuesItemUpdate[]>([])
    const [valuesBeforeUpdate, setValuesBeforeUpdate] = useState<ValuesItemUpdate[]>([])
    const [frequencys, setFrequencys] = useState([])
    /**/  const [selectedMonth, setSelectedMonth] = useState(10)
    /**/  const [selectedYear, setSelectedYear] = useState(2020)

    const todayDate = new Date()
    const selectedDate = todayDate
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()


    /*Outros Estados*/
    /**/ const [contPlusButtonPressed, setContPlusButtonPressed] = useState(0)
    /**/ const [successModal, setSuccessModal] = useState(false)


    //Switch control monthly
    const [show, setShow] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
        updateOneValue('monthly', 0, !isEnabled)
        if (!isEnabled) {
            let newArr = valuesUpdate.map((item, i) => {
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

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

     // funções de navegação
    function handleNavigateEntries() {
        console.log(selectedMonth)
        console.log(selectedYear)
        clearParams()
        nav.navigate('Entries', { item: item, month: selectedMonth, year: selectedYear })
        setSuccessModal(false)
    }

    function clearParams(){
        nav.setParams({month:selectedMonth,year:selectedYear})
    }

    /*Atualiza os valores dos inputs 'valores' */

    const updateValues = (subitem: any, index: any, value: any) => (e: any) => {
        let newArr = valuesArray.map((item, i) => {
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
        let newArr = valuesUpdate.map((item, i) => {
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
        let newArr: any = valuesUpdate.map((item, i) => {
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
        let newArr = valuesArray.map((item, i) => {
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
        let dtEnd = Functions.setDtEnd(isEnabled, valueFrequency, date)
        const GanhoObj = {
            title: valueTitle,
            day: date.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: isEnabled,
            received: isEnabledReceived,
            type: item
        }
        EntriesDB.create(GanhoObj)


        EntriesDB.all().then((res: any) => {
            //console.log(res)
            valuesArray.map(value => {
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
               /* console.log('Descricao: ' + ValueObj.description)
                console.log('valor: ' + ValueObj.amount)
                console.log('dtStart: ' + ValueObj.dtStart)
                console.log('dtEnd: ' + ValueObj.dtEnd)
                console.log('id: ' + ValueObj.entries_id)*/

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
        let dtStart = Functions.setDtStart(date)
        let dtEnd = Functions.setDtEnd(isEnabled, valueFrequency, date)
        const GanhoObj = {
            title: valueTitle,
            day: date.getDate(),
            dtStart: dtStart,
            dtEnd: dtEnd,
            monthly: isEnabled,
            received: isEnabledReceived,
            type: item
        }
        EntriesDB.update(idUpdate, GanhoObj).then(res => {
            valuesUpdate.map((value,index) => {
                var vlr = value.amount
                //console.log('vlr' + vlr)
                if (typeof (vlr) == 'string') {
                    vlr = vlr.replace(/[.]/g, '')
                    vlr = vlr.replace(/[,]/g, '')
                }

                if (value.dtEnd == 209912) {
                    console.log('Valor antes: '+valuesBeforeUpdate[index].amount)
                    const newDtStart = new Date()
                    console.log("dtStart: "+valuesBeforeUpdate[index].dtStart)
                    newDtStart.setMonth(parseInt(Functions.toMonthAndYear(valuesBeforeUpdate[index].dtStart).month)-1)
                    newDtStart.setFullYear(parseInt(Functions.toMonthAndYear(valuesBeforeUpdate[index].dtStart).year))
                    selectedDate.setMonth(month-1)
                    selectedDate.setFullYear(year)
                    let newDtEnd
                    if ((selectedDate.getMonth() + 1) < 10) {
                        newDtEnd = selectedDate.getFullYear().toString() + '0' + (selectedDate.getMonth() + 1).toString()
                    } else {
                        newDtEnd = selectedDate.getFullYear().toString() + (selectedDate.getMonth() + 1).toString()
                    }
                    let contRep = Functions.toFrequency(parseInt(newDtEnd), value.dtStart)
                    if (contRep > 0){
                        console.log("dtEnd: "+newDtEnd)
                        console.log("contRep: "+contRep)
                        console.log("newdtStart: "+newDtStart)
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

    function handleNextMonth() {
        let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
        setSelectedMonth(nextDtObj.nextMonth)
        setSelectedYear(nextDtObj.nextYear)

        selectedDate.setMonth(nextDtObj.nextMonth - 1)
        selectedDate.setFullYear(nextDtObj.nextYear)
        //console.log(selectedDate)

        if (idUpdate == null) {
            date.setMonth(nextDtObj.nextMonth - 1)
            date.setFullYear(nextDtObj.nextYear)
        } else {
            ValuesDB.findByDate(parseInt(nextDtObj.dt)).then((res: any) => {
                var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
                setValuesUpdate(arr)
            })
        }
    }

    function handlePrevMonth() {
        let prevDtObj = Functions.prevMonth(selectedMonth, selectedYear)

        setSelectedMonth(prevDtObj.prevMonth)
        setSelectedYear(prevDtObj.prevYear)

        selectedDate.setMonth(prevDtObj.prevMonth - 1)
        selectedDate.setFullYear(prevDtObj.prevYear)
        //console.log(selectedDate)

        if (idUpdate == null) {
            date.setMonth(prevDtObj.prevMonth - 1)
            date.setFullYear(prevDtObj.prevYear)
        } else {
            ValuesDB.findByDate(parseInt(prevDtObj.dt)).then((res: any) => {
                var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
                setValuesUpdate(arr)
            })
        }
    }

    useEffect(() => {
        if (month != null && year != null) {
            setSelectedMonth(month)
            setSelectedYear(year)
            selectedDate.setMonth(month - 1)
            selectedDate.setFullYear(year)
            console.log('Mes: '+month)
            console.log('Ano: '+year)
            if (idUpdate == null) {
                date.setMonth(month - 1)
                date.setFullYear(year)
            }
        } else {
            setSelectedMonth(CurrentMonth)
            setSelectedYear(CurrentYear)
        }

        if (item === 'Ganhos') {
            setMainColor1('#155F69')
            setMainColor2('#F9CF3C')
            setTittleText('Novo Ganho')
            setTittleTextColor('#1A8289')
            setColorBorderAddButton('#24DBBA')
            setColorMonth('#FDDB63')
            setSecondColor('#49B39F')
            setReceivedText('Recebido')
            setReceivedTextDate('Data de Recebimento')

        } else if (item === 'Despesas') {
            setMainColor1('#CC3728')
            setMainColor2('#F9CF3C')
            setTittleText('Nova Despesa')
            setTittleTextColor('#CC3728')
            setColorBorderAddButton('#FF4835')
            setSecondColor('#FF4835')
            setReceivedText('Pago')
            setReceivedTextDate('Data de Pagamento')
        }
        if (idUpdate != null) {
            let firstDate
            if (month < 10) {
                firstDate = year.toString() + '0' + month.toString()
            } else {
                firstDate = year.toString() + month.toString()
            }
            ValuesDB.findByDate(parseInt(firstDate)).then((res: any) => {
                var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
                setValuesUpdate(arr)
                setValuesBeforeUpdate(arr)
            })
            EntriesDB.findById(idUpdate).then((res: any) => {
                setEarning(res._array)

            }).catch(err => {
                console.log(err)
            })


        }
    }, [])

    function updateValuesList() {
        let firstDate
        if (month < 10) {
            firstDate = year.toString() + '0' + month.toString()
        } else {
            firstDate = year.toString() + month.toString()
        }
        ValuesDB.findByDate(parseInt(firstDate)).then((res: any) => {
            var arr: any = (res._array.filter((vlr: ValuesItemUpdate) => vlr.entries_id == idUpdate))
            setValuesUpdate(arr)
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
                            setValuesUpdate(valuesUpdate.filter(vls => vls.id !== id))
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
                setIsEnabled(true)
            } else {
                setValueFrequency(Functions.toFrequency(earning[0].dtEnd, earning[0].dtStart) + 1)
            }
            if (earning[0].received) {
                setIsEnabledReceived(true)
            }
            date.setDate(earning[0].day)

        }
    }, [earning])

    useEffect(() => {
        setFrequencys([])
        let arrFrequency: any = []
        valuesUpdate.map(value => {
            arrFrequency.push(Functions.toFrequency(value.dtEnd, value.dtStart) + 1)
            //console.log("Frr: " + arrFrequency)
        })
        //console.log(arrFrequency)
        setFrequencys(arrFrequency)
    }, [valuesUpdate])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[mainColor1, mainColor2]} start={{ x: -0.4, y: 0.1 }} style={styles.container}>
                <StatusBar style="light" translucent />
                {/*Mês e ano*/}
                <View style={styles.monthView}>
                    <TouchableOpacity onPress={handlePrevMonth}>
                        <Feather name="chevron-left" size={40} color={colorMonth} />
                    </TouchableOpacity>
                    <Text style={[styles.monthText, { color: colorMonth }]}>
                        {Functions.convertDtToStringMonth(selectedMonth)}  {selectedYear}
                    </Text>
                    <TouchableOpacity onPress={handleNextMonth}>
                        <Feather name="chevron-right" size={40} color={colorMonth} />
                    </TouchableOpacity>
                </View>

                {/* Main container */}

                <View style={styles.mainContainer}>
                    <View style={styles.tittleTextView}>
                        <Text style={[styles.tittleText, { color: tittleTextColor }]}>
                            {tittleText}
                        </Text>
                    </View>
                    <ScrollView style={{ maxHeight: '100%' }}>
                        <View style={styles.formView}>
                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                Título
                            </Text>
                            <TextInput onChangeText={text => onChangeTitle(text)} value={valueTitle} style={styles.InputText} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                        {receivedTextDate}
                                    </Text>
                                    <View style={styles.dateView}>
                                        <Text style={[styles.subTittleText, { color: secondColor }]} onPress={showDatepicker}>
                                            {date.getDate()} / {Functions.convertDtToStringMonth(date.getUTCMonth() + 1)}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                        {receivedText}
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                        thumbColor={isEnabledReceived ? 'd2d2d2' : tittleTextColor}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitchReceived}
                                        value={isEnabledReceived}
                                    />
                                </View>
                            </View>

                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                />
                            )}
                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                Periodicidade
                            </Text>
                            <View style={styles.frequencyView}>
                                <Text style={[styles.secondColorText, { color: secondColor }]}>
                                    Mensal
                                </Text>
                                <Switch
                                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                    thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                                {isEnabled ?
                                    <>
                                        <Feather name='chevron-left' size={30} />
                                        <Text style={{ fontSize: 18 }}>-</Text>
                                        <Feather name='chevron-right' size={30} />
                                    </>
                                    :
                                    <>
                                        <Feather name='chevron-left' size={30}
                                            onPress={() => {
                                                if (valueFrequency > 1) {
                                                    setValueFrequency(valueFrequency - 1)
                                                    updateOneValue('repeat', 0, (valueFrequency - 1))
                                                    let newArr: any = frequencys.map((item, i) => {
                                                        if (i == 0 && item == valueFrequency) {
                                                            return item - 1
                                                        } else {
                                                            return item
                                                        }
                                                    })
                                                    setFrequencys(newArr)
                                                }
                                            }}
                                        />
                                        <Text style={{ fontSize: 18 }}>{valueFrequency}</Text>
                                        <Feather name='chevron-right' size={30}
                                            onPress={() => {
                                                setValueFrequency(valueFrequency + 1)
                                                updateOneValue('repeat', 0, (valueFrequency + 1))
                                                let newArr: any = frequencys.map((item, i) => {
                                                    if (i == 0 && item == valueFrequency) {
                                                        return item + 1
                                                    } else {
                                                        return item
                                                    }
                                                })
                                                setFrequencys(newArr)
                                            }}
                                        />
                                    </>
                                }

                                <Text style={[styles.secondColorText, { color: secondColor }]}>Vezes</Text>
                            </View>
                            <View style={styles.frequencyView}>

                            </View>
                            {idUpdate == null ?
                                <>
                                    <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                        Valor
                            </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.secondColorText, { color: secondColor, marginRight: 10, fontSize: 18 }]}>
                                            R$
                                </Text>
                                        <TextInput
                                            keyboardType='numeric'
                                            placeholder='R$ 0,00'
                                            onChange={updateValues('amount', 0, false)}
                                            value={valuesArray[0].amount.toString()}
                                            style={styles.InputTextValue}
                                        />
                                    </View>
                                </>
                                : null
                            }

                            {idUpdate == null && valuesArray.map((values, index) => {
                                if (showValues)
                                    return (
                                        <View style={styles.valuesViewItem} key={index}>
                                            <View style={styles.valuesView}>
                                                <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                                    Descrição
                                                </Text>
                                                <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                                    Valor
                                                </Text>
                                            </View>
                                            <View style={styles.valuesView}>

                                                <TextInput
                                                    onChange={updateValues('description', index, false)}
                                                    value={values.description}
                                                    style={[styles.InputText, { width: 150 }]}
                                                />
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.secondColorText, { color: secondColor, marginRight: 10, fontSize: 18 }]}>
                                                        R$
                                                </Text>
                                                    <TextInput
                                                        keyboardType='numeric'
                                                        placeholder='R$ 0,00'
                                                        onChange={updateValues('amount', index, false)}
                                                        value={values.amount.toString()}
                                                        style={styles.InputTextValue}
                                                    />
                                                </View>

                                            </View>
                                            <View style={styles.valuesView}>
                                                <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                                    Periodicidade
                                                </Text>
                                            </View>
                                            <View style={styles.frequencyView}>
                                                <Text style={[styles.secondColorText, { color: secondColor }]}>Mensal</Text>
                                                <Switch
                                                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                                    thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={updateValues('monthly', index, values.monthly)}
                                                    value={values.monthly}
                                                />

                                                <TextInput
                                                    onChange={updateValues('repeat', index, false)}
                                                    value={values.repeat.toString()}
                                                    style={styles.InputText}
                                                    keyboardType='numeric'
                                                />

                                                <Text style={[styles.secondColorText, { color: secondColor }]}>Vezes</Text>
                                            </View>
                                        </View>
                                    )
                            })}

                            {idUpdate != null && valuesUpdate.map((values, index) => {
                                var monthly = false

                                if (values.dtEnd == 209912) {
                                    monthly = true
                                }
                                return (
                                    <View style={styles.valuesViewItem} key={index}>
                                        <View style={styles.valuesView}>
                                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                                Descrição
                                            </Text>
                                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                                Valor
                                            </Text>
                                        </View>
                                        <View style={styles.valuesView}>

                                            <TextInput
                                                onChange={updateValuesUpdate('description', index, false)}
                                                value={values.description}
                                                style={[styles.InputText, { width: 150 }]} />

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={[styles.secondColorText, { color: secondColor, marginRight: 10, fontSize: 18 }]}>
                                                    R$
                                                </Text>
                                                <TextInput
                                                    keyboardType='numeric'
                                                    placeholder='R$ 0,00'
                                                    onChange={updateValuesUpdate('amount', index, false)}
                                                    value={Functions.formatCurrency(values.amount)}
                                                    style={styles.InputTextValue} />
                                            </View>

                                        </View>
                                        <View style={styles.frequencyView}>
                                            <Text style={[styles.secondColorText, { color: secondColor }]}>Mensal</Text>
                                            <Switch
                                                trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                                thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={updateValuesUpdate('monthly', index, [monthly, frequencys[index]])}
                                                value={monthly}
                                            />
                                            <Feather name='chevron-left' size={30}
                                                onPress={() => {
                                                    let newArr: any = frequencys.map((item, i) => {
                                                        if (index == i) {
                                                            return item - 1
                                                        } else {
                                                            return item
                                                        }
                                                    })
                                                    setFrequencys(newArr)
                                                    //console.log('NewArr: ' + newArr)
                                                    updateFrequencyValuesUpdate('repeat', index, [monthly, frequencys[index] - 1])
                                                    //console.log('freq: ' + frequencys[index])
                                                }}
                                            />
                                            {monthly ?
                                                <Text>1</Text> :
                                                <Text style={{ fontSize: 18 }}>{frequencys[index]}</Text>}
                                            <Feather name='chevron-right' size={30}
                                                onPress={() => {
                                                    let newArr: any = frequencys.map((item, i) => {
                                                        if (index == i) {
                                                            return item + 1
                                                        } else {
                                                            return item
                                                        }
                                                    })
                                                    setFrequencys(newArr)
                                                    //console.log(frequencys[index])
                                                    updateFrequencyValuesUpdate('repeat', index, [monthly, frequencys[index] + 1])
                                                    //console.log('freq: ' + frequencys[index])
                                                }}
                                            />

                                            <Text style={[styles.secondColorText, { color: secondColor }]}>Vezes</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', margin: 10 }}>
                                            <TouchableOpacity onPress={() => removeValue(values.id)}>
                                                <Feather name="trash-2" size={20} color={colorBorderAddButton} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}

                            <View style={styles.newValuesView}>
                                <Text style={[styles.newValuesText, { color: tittleTextColor }]}>
                                    Adcionar Novos Valores
                                </Text>
                                <TouchableOpacity style={[styles.plusButtonModal, { borderColor: colorBorderAddButton }]}
                                    onPress={() => {
                                        setShowValues(true)
                                        setContPlusButtonPressed(contPlusButtonPressed + 1)
                                        if (contPlusButtonPressed > 0) {

                                            setIdValues(idValues + 1)
                                            setValuesArray([...valuesArray, { id: idValues, description: '', amount: '0', monthly: false, repeat: 1 }])

                                            //console.log(idValues)
                                            //console.log(valuesArray)
                                        }
                                        if (idUpdate != null) {
                                            selectedDate.setMonth(selectedMonth - 1)
                                            selectedDate.setFullYear(selectedYear)
                                            const newValueObj = {
                                                description: '',
                                                amount: '0',
                                                dtStart: Functions.setDtStart(selectedDate),
                                                dtEnd: Functions.setDtEnd(false, 0, selectedDate),
                                                entries_id: idUpdate
                                            }

                                            //console.log('selectedDate: ' + selectedDate)
                                            //console.log('dtStart: '+newValueObj.dtStart)
                                            //console.log('dtStart: ' + newValueObj.dtStart)
                                            //console.log('dtEnd: ' + newValueObj.dtEnd)
                                            ValuesDB.create(newValueObj)
                                            updateValuesList()

                                        }
                                    }}>
                                    <Feather name='plus' size={40} color={tittleTextColor} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <LinearGradient
                                colors={['#FFFFFF', colorBorderAddButton + '22']}
                                start={{ x: -0.1, y: 0.1 }}
                                style={[styles.addNewButton, { borderColor: colorBorderAddButton }]}>
                                {idUpdate != null ?
                                    <TouchableOpacity
                                        style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                                        onPress={handleUpdate}
                                    >
                                        <Text style={[styles.addNewButtonText, { color: tittleTextColor }]}>Atualizar</Text>
                                    </TouchableOpacity>
                                    : <TouchableOpacity
                                        style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                                        onPress={handleCreateNew}
                                    >
                                        <Text style={[styles.addNewButtonText, { color: tittleTextColor }]}>Adicionar</Text>
                                    </TouchableOpacity>
                                }
                            </LinearGradient>
                        </View>
                    </ScrollView>

                    <Footer item={item}></Footer>
                </View>

                <Modal animationType="slide" visible={successModal} transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalTextView}>
                                {idUpdate == null ?
                                    <Text style={styles.modalText}>
                                        Cadastro realizado com sucesso!
                                </Text>
                                    :
                                    <Text style={styles.modalText}>
                                        Atualizado com sucesso!
                                </Text>
                                }
                            </View>
                            <TouchableOpacity onPress={handleNavigateEntries} style={styles.modalButton}>
                                <Text style={[styles.tittleText, { color: tittleTextColor }]}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        textAlign: 'center',
    },
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 19,
    },
    valuesView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateView: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        flexDirection: 'row'
    },
    valuesViewItem: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 15,
        paddingVertical: 5,
        paddingBottom: 10,
        justifyContent: 'center',
        marginBottom: 10,
        borderColor: '#eaeaea',
        borderWidth: 1,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: ' rgba(0, 0, 0, 0.39);',
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 30,
    },
    modalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        borderTopWidth: 1,
        borderTopColor: '#d2d2d2',
        width: '100%'
    },
    modalTextView: {
        minHeight: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        color: '#136065',
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
    },
    tittleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 26,
    },
    tittleText: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
    },
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginTop: 13,
    },
    earningsTextColor: {
        color: '#1A8289',
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
    plusButtonModal: {
        borderRadius: 10,
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#1A8289',
        justifyContent: 'center',
        alignItems: 'center'
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
    scrollViewContainer: {
        maxHeight: 320,
        marginTop: 20,
    },
    monthView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
    },
    monthText: {
        color: "#FDDB63",
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        marginHorizontal: 5
    },

    balanceView: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
    },

    currentBalanceView: {
        justifyContent: 'center',
        marginHorizontal: 26,
    },

    currentBalanceText: {
        color: '#fff',
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        textAlign: 'center'
    },

    currentBalanceTextValue: {
        color: '#fff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        textAlign: 'center'
    },

    estimatedBalanceText: {
        color: 'rgba(255, 255, 255, 0.62);',
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        textAlign: 'center'
    },

    estimatedBalanceTextValue: {
        color: 'rgba(255, 255, 255, 0.62);',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        textAlign: 'center'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 33,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start',
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
        backgroundColor: "#fff",
        borderRadius: 20,
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
    earningValueText: {
        color: '#1A8289',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
    addNewButton: {
        borderStyle: 'solid',
        borderRadius: 20,
        borderColor: '#24DBBA',
        borderWidth: 1,
        height: 83,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 26,
        marginVertical: 25,
    },
    addNewButtonText: {
        color: '#1A8289',
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
    secondColorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    newValuesView: {
        alignItems: "center",
        paddingVertical: 26,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    newValuesText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    }

})

