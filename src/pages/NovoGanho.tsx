import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, Button, TextInput, Platform, KeyboardAvoidingView, Modal, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import Footer from './components/footer'
import { ScrollView, Switch } from 'react-native-gesture-handler';

import Ganhos from '../services/ganhos'
import Valores from '../services/valores'
import Functions from '../functions/index'

export default function NovoGanho({ route }: { route: any }, { navigation }: { navigation: any }) {

    const { item } = route.params
    const { idUpdate } = route.params
    const nav = useNavigation()

    /*Interfaces*/

    interface ValuesItem {
        id: number,
        description: string,
        value: string,
        mensal: boolean,
        repeat: number,
    }

    interface ValuesItemUpdate {
        id: number,
        descricao: string,
        valor: string,
        dtInicio: number,
        dtFim: number,
        ganhos_id: number,
    }

    interface earningValues {
        titulo: string,
        dia: number,
        dtInicio: number,
        dtFim: number,
        mensal: boolean,
        recebido: boolean,
    }

    /*Estados de aparencia*/
    /**/ const [mainColor1, setMainColor1] = useState('')
    /**/ const [mainColor2, setMainColor2] = useState('')
    /**/ const [tittleText, setTittleText] = useState('')
    /**/ const [tittleTextColor, setTittleTextColor] = useState('#fff')
    /**/ const [valueTitulo, onChangeTitulo] = useState('');
    /**/ const [colorBorderAddButton, setColorBorderAddButton] = useState('#fff')
    /**/ const [secondColor, setSecondColor] = useState('#fff')
    /**/ const [colorMonth, setColorMonth] = useState('#fff')
    /**/
    /**/

    /*Estados de valores*/
    /**/ const [idValues, setIdValues] = useState(0)
    /**/ const [valueFrequency, setValueFrequency] = useState(0);
    /**/ const [valuesArray, setValuesArray] = useState<ValuesItem[]>([{
        id: 0,
        description: '',
        value: '0',
        mensal: false,
        repeat: 0
    }])
    /**/ const [showValues, setShowValues] = useState(false)
    const [earning, setEarning] = useState<earningValues[]>([])
    const [valuesUpdate, setValuesUpdate] = useState<ValuesItemUpdate[]>([])


    /*Outros Estados*/
    /**/ const [contPlusButtonPressed, setContPlusButtonPressed] = useState(0)
    /**/ const [successModal, setSuccessModal] = useState(false)


    //Switch control Mensal
    const [show, setShow] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
        updateOneValue('mensal', 0, !isEnabled)
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

    /*Atualiza os valores dos inputs 'valores' */

    const updateValues = (subitem: any, index: any, value: any) => (e: any) => {
        let newArr = valuesArray.map((item, i) => {
            if (index == i) {
                if (subitem == 'mensal') {
                    return { ...item, [subitem]: value = !value }
                }
                else if (subitem == 'value') {
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
                if (subitem == 'mensal') {
                    console.log(value)
                    var fr = 0
                    if (!value[0]) {
                        fr = value[1]
                        return { ...item, ['dtFim']: 209912 }
                    } else {
                        var dt = new Date()
                        var dtFim = Functions.setDtFim(false, fr, dt)
                        console.log(dtFim)
                        return { ...item, ['dtFim']: dtFim }
                    }
                }
                else if (subitem == 'repeat') {
                    var dt = new Date()
                    var rpt = parseInt(e.nativeEvent.text)
                    var dtFim = Functions.setDtFim(value[0], rpt, dt)
                    return { ...item, ['dtFim']: dtFim }

                }
                else if (subitem == 'value') {
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

    /*Atualiza os valores da periodicidade */
    const updateOneValue = (subitem: any, index: any, value: any) => {
        let newArr = valuesArray.map((item, i) => {
            if (index == i) {
                if (subitem == 'mensal') {
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
        let dtInicio = Functions.setDtInicio(date)
        let dtFim = Functions.setDtFim(isEnabled, valueFrequency, date)
        const GanhoObj = {
            titulo: valueTitulo,
            dia: date.getDate(),
            dtInicio: dtInicio,
            dtFim: dtFim,
            mensal: isEnabled,
            recebido: isEnabledReceived,
            tipo: item
        }
        Ganhos.create(GanhoObj)

        Ganhos.all().then(res => {
            //console.log(res)
            valuesArray.map(value => {
                var vlr = value.value
                vlr = vlr.replace(/[.]/g, '')
                vlr = vlr.replace(/[,]/g, '')
                console.log(vlr)
                const ValueObj = {
                    descricao: value.description,
                    valor: vlr,
                    dtInicio: dtInicio,
                    dtFim: Functions.setDtFim(value.mensal, value.repeat, date),
                    ganhos_id: res._array.slice(-1)[0].id
                }
                Valores.create(ValueObj)
                setSuccessModal(true)
            })

        }).catch(err => {
            console.log(err)
        })


    }

    function handleUpdate() {
        let dtInicio = Functions.setDtInicio(date)
        let dtFim = Functions.setDtFim(isEnabled, valueFrequency, date)
        const GanhoObj = {
            titulo: valueTitulo,
            dia: date.getDate(),
            dtInicio: dtInicio,
            dtFim: dtFim,
            mensal: isEnabled,
            recebido: isEnabledReceived,
            tipo: item
        }
        Ganhos.update(idUpdate, GanhoObj).then(res => {
            valuesUpdate.map(value => {
                var vlr = value.valor
                console.log(vlr)

               
                const ValueObj = {
                    descricao: value.descricao,
                    valor: vlr,
                    dtInicio: value.dtInicio,
                    dtFim: value.dtFim,
                    ganhos_id: idUpdate
                }
                Valores.update(value.id, ValueObj)
            })
            alert('atualizado')
            
        }).catch(err => {
            console.log(err)
        })
    }

    function handleResultsByMonth() {

        //console.log(date.toLocaleDateString('en-GB'))
        /*const date2 = new Date()
        date2.setFullYear(2021)
        const datef = date2.getFullYear().toString()+'/'+date2.getMonth().toString()
        console.log(datef)
        if('2021/12' < datef){
            console.log('seila')
        }else if('2020/11' > datef){
            console.log('q')
        }
        /*const FindDate = '112021'
        Ganhos.findByDate(FindDate).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })*/

        /*Ganhos.findByDate(202104).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })*/
        var dtfim = 202101
        var dtInicio = 202012

        console.log(Functions.toFrequency(dtfim, dtInicio))
    }

    useEffect(() => {
        if (item === 'Ganhos') {
            setMainColor1('#155F69')
            setMainColor2('#F9CF3C')
            setTittleText('Novo Ganho')
            setTittleTextColor('#1A8289')
            setColorBorderAddButton('#24DBBA')
            setColorMonth('#FDDB63')
            setSecondColor('#49B39F')

        } else if (item === 'Despesas') {
            setMainColor1('#CC3728')
            setMainColor2('#F9CF3C')
            setTittleText('Nova Despesa')
            setTittleTextColor('#CC3728')
            setColorBorderAddButton('#FF4835')
            setSecondColor('#FF4835')
        }
        if (idUpdate != null) {
            //console.log('id = '+idUpdate)
            Valores.all().then(res => {
                var arr: any = (res._array.filter(vlr => vlr.ganhos_id == idUpdate))
                setValuesUpdate(arr)
            })
            Ganhos.findById(idUpdate).then(res => {
                setEarning(res._array)

            }).catch(err => {
                console.log(err)
            })


        }
    }, [])

    useEffect(() => {
        if (earning.length > 0) {
            onChangeTitulo(earning[0].titulo)
            if (earning[0].mensal) {
                setIsEnabled(true)
            } else {
                setValueFrequency(Functions.toFrequency(earning[0].dtFim, earning[0].dtInicio))
            }
            date.setDate(earning[0].dia)

        }
    }, [earning])


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[mainColor1, mainColor2]} start={{ x: -0.4, y: 0.1 }} style={styles.container}>
                <StatusBar style="light" translucent />
                <View style={styles.monthView}>
                    <TouchableOpacity onPress={() => { }}>
                        <Feather name="arrow-left" size={30} color={colorMonth} />
                    </TouchableOpacity>
                    <Text style={[styles.monthText, { color: colorMonth }]}>
                        Nov 2020
                </Text>
                    <TouchableOpacity onPress={handleResultsByMonth}>
                        <Feather name="arrow-right" size={30} color={colorMonth} />
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
                            <TextInput onChangeText={text => onChangeTitulo(text)} value={valueTitulo} style={styles.InputText} />
                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                Data de Recebimento
                            </Text>
                            <View style={styles.dateView}>
                                <Text style={[styles.subTittleText, { color: secondColor }]} onPress={showDatepicker}>
                                    {date.getDate()} / {date.getUTCMonth() + 1}
                                </Text>
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
                                <Text style={[styles.secondColorText, { color: secondColor }]}>Mensal</Text>
                                <Switch
                                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                    thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                                <Feather name='arrow-left' size={20}
                                    onPress={() => {
                                        setValueFrequency(valueFrequency - 1)
                                        updateOneValue('repeat', 0, (valueFrequency - 1))
                                    }}
                                />
                                <Text>{valueFrequency}</Text>
                                <Feather name='arrow-right' size={20}
                                    onPress={() => {
                                        setValueFrequency(valueFrequency + 1)
                                        updateOneValue('repeat', 0, (valueFrequency + 1))
                                    }}
                                />
                                <Text style={[styles.secondColorText, { color: secondColor }]}>Vezes</Text>
                            </View>
                            <View style={styles.frequencyView}>
                                <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                    Recebido
                                </Text>
                                <Switch
                                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                    thumbColor={isEnabledReceived ? 'd2d2d2' : tittleTextColor}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitchReceived}
                                    value={isEnabledReceived}
                                />
                            </View>
                            <Text style={[styles.subTittleText, { color: tittleTextColor }]}>
                                Valor
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.secondColorText, { color: secondColor, marginRight: 10 }]}>R$</Text>
                                <TextInput
                                    keyboardType='numeric'
                                    placeholder='R$ 0,00'
                                    onChange={updateValues('value', 0, false)}
                                    value={valuesArray[0].value.toString()}
                                    style={styles.InputText}
                                />

                            </View>

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

                                                <TextInput onChange={updateValues('description', index, false)} value={values.description} style={styles.InputText} />
                                                <TextInput placeholder='R$ 0,00' onChange={updateValues('value', index, false)} value={values.value.toString()} style={styles.InputText} />

                                            </View>
                                            <View style={styles.frequencyView}>
                                                <Text>Mensal</Text>
                                                <Switch
                                                    trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                                    thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={updateValues('mensal', index, values.mensal)}
                                                    value={values.mensal}
                                                />

                                                <TextInput
                                                    onChange={updateValues('repeat', index, false)}
                                                    value={values.repeat.toString()}
                                                    style={styles.InputText}
                                                    keyboardType='numeric'
                                                />

                                                <Text>Vezes</Text>
                                            </View>
                                        </View>
                                    )
                            })}

                            {idUpdate != null && valuesUpdate.map((values, index) => {
                                var mensal = false
                                var frequency = Functions.toFrequency(values.dtFim, values.dtInicio)
                                if (values.dtFim == 209912) {
                                    mensal = true
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

                                            <TextInput onChange={updateValuesUpdate('descricao', index, false)} value={values.descricao} style={styles.InputText} />
                                            <TextInput placeholder='R$ 0,00' onChange={updateValuesUpdate('valor', index, false)} value={values.valor.toString()} style={styles.InputText} />

                                        </View>
                                        <View style={styles.frequencyView}>
                                            <Text>Mensal</Text>
                                            <Switch
                                                trackColor={{ false: '#d2d2d2', true: tittleTextColor }}
                                                thumbColor={isEnabled ? 'd2d2d2' : tittleTextColor}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={updateValuesUpdate('mensal', index, [mensal, frequency])}
                                                value={mensal}
                                            />


                                            <TextInput
                                                onChange={updateValuesUpdate('repeat', index, [mensal, frequency])}
                                                value={mensal ? '0' : frequency.toString()}
                                                style={styles.InputText}
                                                keyboardType='numeric'
                                            />

                                            <Text>Vezes</Text>
                                        </View>
                                    </View>
                                )
                            })}

                            <View style={{ alignItems: "flex-end", paddingVertical: 26 }}>
                                <TouchableOpacity style={[styles.plusButtonModal, { borderColor: colorBorderAddButton }]}
                                    onPress={() => {
                                        setShowValues(true)
                                        setContPlusButtonPressed(contPlusButtonPressed + 1)
                                        if (contPlusButtonPressed > 0) {
                                            setIdValues(idValues + 1)
                                            setValuesArray([...valuesArray, { id: idValues, description: '', value: '0', mensal: false, repeat: 0 }])
                                            //console.log(idValues)
                                            //console.log(valuesArray)
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
                                <Text style={styles.modalText}>
                                    Cadastro realizado com sucesso!
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => nav.goBack()} style={styles.modalButton}>
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
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valuesView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateView: {
        borderWidth: 1,
        borderColor: '#d2d2d2',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
    },
    valuesViewItem: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 15,
        paddingVertical: 5,
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
    }

})

