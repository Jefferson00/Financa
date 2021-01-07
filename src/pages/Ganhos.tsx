import React, { useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import Footer from './components/footer'

import GanhosBD from '../services/ganhos'
import Valores from '../services/valores';
import Functions from '../functions/index'
import Recebidos from '../services/recebidos'

export default function Ganhos({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigation2 = useNavigation()

    const [selectedId, setSelectedId] = useState(0)
    const [selectedTotalValues, setSelectedTotalValues] = useState(0)

    function showModal(id: number, totalValues: number) {
        setModalVisible(true);
        setSelectedId(id)
        setSelectedTotalValues(totalValues)
    }

    interface EarningsValues {
        id: number,
        titulo: string,
        dia: number,
        dtInicio: number,
        dtFim: number,
        mensal: boolean,
        recebido: boolean,
    }

    interface EarningsRecebidos {
        ganhos_id:number,
        id: number,
        month: number,
        recebido: number,
        year: number,
    }

    interface ValuesValues {
        id:number,
        descricao: string,
        valor: number,
        dtInicio: number,
        dtFim: number,
        ganhos_id: number,
        dia: number,
        tipo: string,
    }

    const [modalVisible, setModalVisible] = useState(false)
    const [mainColor1, setMainColor1] = useState('')
    const [mainColor2, setMainColor2] = useState('')
    const [mainText1, setMainText1] = useState('')
    const [mainText2, setMainText2] = useState('')
    const [TextAddButton, setTextAddButton] = useState('')
    const [colorMonth, setColorMonth] = useState('#fff')
    const [colorText, setColorText] = useState('#fff')
    const [colorBorderAddButton, setColorBorderAddButton] = useState('#fff')
    const [colorBorderFooter, setColorBorderFooter] = useState('#fff')

    const [selectedMonth, setSelectedMonth] = useState(10)
    const [selectedYear, setSelectedYear] = useState(2020)

    const [totalCurrentValues, setTotalCurrentValues] = useState(0)
    const [totalEstimatedValues, setTotalEstimatedValues] = useState(0)

    const [earnings, setEarnings] = useState<EarningsValues[]>([])
    const [valuesList, setValuesList] = useState<ValuesValues[]>([])

    const todayDate = new Date()
    const currentDate = new Date()
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    const { item } = route.params

    function handleNavigateNovo() {
        navigation2.navigate('NovoGanho', { item: item })
    }

    function handleNavigateNovoUpdate(id: number) {
        setModalVisible(false)
        navigation2.navigate('NovoGanho', { item: item , idUpdate: id})
    }

    function handleNextMonth() {
        //console.log(selectedMonth)
        let nextDtObj = Functions.nextMonth(selectedMonth, selectedYear)
        GanhosBD.findByDate(parseInt(nextDtObj.dt)).then(res => {
          setEarnings(res._array.filter(earning => earning.tipo == item))
        }).catch(err => {
          setEarnings([])
          console.log(err)
        })
    
        Valores.findByDate(parseInt(nextDtObj.dt)).then(res => {
          //console.log(res)
          setValuesList(res._array)
        }).catch(err => {
          setValuesList([])
          console.log(err)
        })
    
        //console.log(parseInt(nextDtObj))
        setSelectedMonth(nextDtObj.nextMonth)
        setSelectedYear(nextDtObj.nextYear)
        
      }

      function handlePrevMonth() {
        let prevDtObj = Functions.prevMonth(selectedMonth, selectedYear)
        
        GanhosBD.findByDate(parseInt(prevDtObj.dt)).then(res => {
          setEarnings(res._array.filter(earning => earning.tipo == item))
        }).catch(err => {
          setEarnings([])
          console.log(err)
        })
    
        Valores.findByDate(parseInt(prevDtObj.dt)).then(res => {
          //console.log(res)
          setValuesList(res._array)
        }).catch(err => {
          setValuesList([])
          console.log(err)
        })
    
        setSelectedMonth(prevDtObj.prevMonth)
        setSelectedYear(prevDtObj.prevYear)

      }


    const setData = (date: Date) => {
        return new Promise((resolve, reject) => {
            let cont: any = []
            let cont2: any = []
            valuesList.map(value => {
                if (value.valor != null && value.valor != 0) cont.push(value.valor)
                if (value.dia <= date.getDate()) cont2.push(value.valor)
            })
            resolve(cont)
        })

    }
    let cont: any = []
    let cont2: any = []

    function removeItem(id: number) {
        //console.log(id)
        Alert.alert(
            "Remover",
            "Deseja mesmo remover?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => 
                GanhosBD.remove2(id).then(res => {
                    alert('removido!')
                    setEarnings(earnings.filter(ern => ern.id !== id))
                    setValuesList(valuesList.filter(vlu => vlu.ganhos_id !== id))
                    setModalVisible(false)
                }).catch(err => {
                    console.log(err)
                })
            }
            ],
            { cancelable: false }
          );
    }

    function removeValue(id: number){
        Alert.alert(
            "Remover",
            "Deseja mesmo remover?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => 
                Valores.remove(id).then(res => {
                    setValuesList(valuesList.filter(vls => vls.id !== id))
                }).catch(err => {
                    console.log(err)
                })
            }
            ],
            { cancelable: false }
          );
    }

    useEffect(() => {
        if (item === 'Ganhos') {
            setMainColor1('#155F69')
            setMainColor2('#F9CF3C')
            setMainText1('Ganhos Atuais')
            setMainText2('Ganhos Estimados')
            setColorMonth('#FDDB63')
            setColorText('#1A8289')
            setColorBorderAddButton('#24DBBA')
            setColorBorderFooter('#1A828922')
            setTextAddButton('Adicionar Novo Ganho')

        } else if (item === 'Despesas') {
            setMainColor1('#CC3728')
            setMainColor2('#F9CF3C')
            setMainText1('Despesas Atuais')
            setMainText2('Despesas Estimadas')
            setColorMonth('#FFF')
            setColorText('#CC3728')
            setColorBorderAddButton('#FF4835')
            setColorBorderFooter('#CC372822')
            setTextAddButton('Adicionar Nova Despesa')
        }

        setSelectedMonth(CurrentMonth)
        setSelectedYear(CurrentYear)

        setData(todayDate)



        const unsubscribe = navigation2.addListener('focus', () => {
            console.log('Refreshed!');
            let firstDate
            if (CurrentMonth < 10) {
                firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
            } else {
                firstDate = CurrentYear.toString() + CurrentMonth.toString()
            }
            GanhosBD.findByDateOrderByDay(parseInt(firstDate)).then(res => {
                setEarnings(res._array.filter(earning => earning.tipo == item))
            }).catch(err => {
                console.log(err)
            })
            Valores.findByDate(parseInt(firstDate)).then(res => {
                //console.log(res._array)
                setValuesList(res._array)

            }).catch(err => {
                console.log(err)
            })

        });
        return unsubscribe;

    }, [navigation2])



    return (
        <LinearGradient
            colors={[mainColor1, mainColor2]}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
        <StatusBar style="light" translucent />
        <View style={styles.monthView}>
            <TouchableOpacity onPress={handlePrevMonth}>
                <Feather name="arrow-left" size={30} color={colorMonth} />
            </TouchableOpacity>
            <Text style={[styles.monthText, { color: colorMonth }]}>
                {Functions.convertDtToStringMonth(selectedMonth)}  {selectedYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
                <Feather name="arrow-right" size={30} color={colorMonth} />
            </TouchableOpacity>
        </View>
        {valuesList.map(value => {
            if (value.valor != null && value.valor != 0 && value.tipo == item) cont.push(value.valor)
            if (value.dia <= todayDate.getDate() && value.tipo == item) cont2.push(value.valor)
        })}
        <View style={styles.balanceView}>
            <View style={styles.currentBalanceView}>
                <Text style={styles.currentBalanceText}>
                    {mainText1}
                </Text>
                <NumberFormat
                    value={cont2.reduce((a: any, b: any) => a + b, 0)}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => <Text style={styles.currentBalanceTextValue}> {value} </Text>}
                />
            </View>
            <View style={styles.currentBalanceView}>
                <Text style={styles.estimatedBalanceText}>
                    {mainText2}
                </Text>
                <NumberFormat
                    value={cont.reduce((a: any, b: any) => a + b, 0)}
                    displayType={'text'}
                    thousandSeparator={true}
                    format={Functions.currencyFormatter}
                    renderText={value => <Text style={styles.estimatedBalanceTextValue}> {value} </Text>}
                />
            </View>
        </View>

        <View style={styles.mainContainer}>
            <View style={{ flex: 1,height:'100%'}}>
            <ScrollView style={styles.scrollViewContainer}>
                {}
                {earnings.map((earning, index) => {
                    var totalValues = 0
                    var opac = 1
     
                    if (earning.dia > todayDate.getDate()) {
                        opac = 0.7
                    }
                    return (
                        
                        <TouchableOpacity 
                        style={[styles.earningsItemView,{opacity:opac}]} 
                        onPress={() => showModal(earning.id, totalValues)} 
                        key={index}>
                            <Feather name="dollar-sign" size={40} color={colorText} />
                                {valuesList.map(value => {
                                    if (earnings[index].id == value.ganhos_id) {
                                        totalValues = totalValues + value.valor
                                        //console.log(totalValues)
                                    }
                                })}
                                

                            <View style={styles.earningTextView}>
                                <Text style={[styles.earningTittleText, { color: colorText }]}>
                                    {earning.titulo}
                                </Text>
                                <Text style={[styles.earningDateText, { color: colorText }]}>
                                    {earning.dia}/{Functions.convertDtToStringMonth(earning.dtInicio)}
                                </Text>
                            </View>

                            <NumberFormat
                                value={totalValues}
                                displayType={'text'}
                                thousandSeparator={true}
                                format={Functions.currencyFormatter}
                                renderText={value => <Text style={[styles.earningTittleText, { color: colorText }]}> {value} </Text>}
                            />

                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            </View>

            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <LinearGradient
                colors={['#FFFFFF', colorBorderFooter]}
                start={{ x: -0.1, y: 0.1 }}
                style={[styles.addNewButton, { borderColor: colorBorderAddButton }]}>
                    <TouchableOpacity 
                    style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                    onPress={handleNavigateNovo}>
                        <Text style={[styles.addNewButtonText, { color: colorText }]}>
                            {TextAddButton}
                        </Text>
                        <Feather name="plus" size={40} color={colorText} style={{marginLeft:10}}/>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <Footer item={item}></Footer>
        </View>

        <Modal animationType="slide" visible={modalVisible} transparent>
            <View style={styles.modalContainer}>

                <View style={styles.modalContent}>
                    {earnings.map((earning, index) => {
                        if (earning.id == selectedId) {
                            return (
                                <View key={index}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(26, 130, 137, 0.33)', paddingBottom: 17, marginBottom: 37 }}>
                                        <View style={styles.tittleView}>
                                            <Text style={[styles.tittleText, { color: colorText }]}>
                                                {earning.titulo}
                                            </Text>
                                            <TouchableOpacity onPress={() => removeItem(earning.id)}>
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
                                                    {earning.dia} {Functions.convertDtToStringMonth(earning.dtInicio)}
                                                </Text>
                                            </View>
                                        </View>
                                        {valuesList.map((value, index) => {
                                            currentDate.setMonth(selectedMonth-1) 
                                            currentDate.setFullYear(selectedYear)
                                            if (earning.id == value.ganhos_id)
                                                return (
                                                    <View style={styles.valuesList} key={index}>
                                                        <View style={{flexDirection:'row'}}>
                                                            <Text style={[styles.valuesListText, { color: colorText , marginRight:5}]}>
                                                                {value.descricao}
                                                            </Text>
                                                            <Text style={[styles.valuesListText, { color: colorBorderAddButton }]}>
                                                                {Functions.toFrequency(value.dtFim,value.dtInicio) < 948 ? Functions.toFrequency(value.dtFim,value.dtInicio) - Functions.toFrequency(value.dtFim,Functions.setDtInicio(currentDate)) + "/" + Functions.toFrequency(value.dtFim,value.dtInicio)+")" : null}
                                                            </Text>
                                                        </View>
                                                        <View style={{flexDirection:'row'}}>
                                                            <NumberFormat
                                                                value={value.valor}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                format={Functions.currencyFormatter}
                                                                renderText={value => <Text style={[styles.valuesListText, { color: colorText }]}> {value} </Text>}
                                                            />
                                                            <TouchableOpacity onPress={() => removeValue(value.id)}>
                                                                <Feather name="trash-2" size={20} color={colorBorderAddButton} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        
                                                    </View>
                                                )
                                        })}
                                    </View>
                                )
                            }
                        })}


                        <View style={{ alignItems: "flex-end", padding: 26 }}>
                            <TouchableOpacity style={[styles.plusButtonModal, { borderColor: colorBorderAddButton }]}>
                                <Feather name='plus' size={40} color={colorText} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerModal}>
                            <TouchableOpacity onPress={()=> {handleNavigateNovoUpdate(selectedId)}}>
                                <Feather name="edit-2" size={30} color={colorText} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                <Feather name="x" size={30} color={colorText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </LinearGradient>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },
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
        minHeight:400,
        marginTop: 20,
        flex: 1,
    },
    //Texto do Mês
    monthView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 26,
        marginTop: 13,
    },
    monthText: {
        color: '#ffffff',
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

    //Main Container
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

})
