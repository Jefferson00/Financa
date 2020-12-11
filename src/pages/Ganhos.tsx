import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

import Footer from './components/footer'

import GanhosBD from '../services/ganhos'
import Valores from '../services/valores';


export default function Ganhos({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigation2 = useNavigation()

    function showModal() {
        setModalVisible(true);
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

    interface ValuesValues {
        descricao: string,
        valor: number,
        dtInicio: number,
        dtFim: number,
        ganhos_id: number,
        dia: number,
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
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    const { item } = route.params

    function handleNavigateNovo() {
        navigation2.navigate('NovoGanho', { item: item })
    }
    const setData = (date: Date) => {
        return new Promise((resolve,reject)=>{
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

        let firstDate
        if (CurrentMonth < 10) {
            firstDate = CurrentYear.toString() + '0' + CurrentMonth.toString()
        } else {
            firstDate = CurrentYear.toString() + CurrentMonth.toString()
        }
        GanhosBD.findByDate(parseInt(firstDate)).then(res => {
            setEarnings(res._array)
        }).catch(err => {
            console.log(err)
        })
        Valores.findByDate(parseInt(firstDate)).then(res => {
            setValuesList(res._array)

        }).catch(err => {
            console.log(err)
        })
  
    }, [])

    return (
        <LinearGradient
            colors={[mainColor1, mainColor2]}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
            <StatusBar style="light" translucent />
            <View style={styles.monthView}>
                <TouchableOpacity onPress={() => { }}>
                    <Feather name="arrow-left" size={30} color={colorMonth} />
                </TouchableOpacity>
                <Text style={[styles.monthText, { color: colorMonth }]}>
                    {selectedMonth} / {selectedYear}
                </Text>
                <TouchableOpacity onPress={() => { }}>
                    <Feather name="arrow-right" size={30} color={colorMonth} />
                </TouchableOpacity>
            </View>
            {valuesList.map(value => {
            if (value.valor != null && value.valor != 0) cont.push(value.valor)
            if (value.dia <= todayDate.getDate()) cont2.push(value.valor)
            })}
            <View style={styles.balanceView}>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.currentBalanceText}>
                        {mainText1}
                    </Text>
                    <Text style={styles.currentBalanceTextValue}>
                        R$ {cont2.reduce((a: any, b: any) => a + b, 0)}
                    </Text>
                </View>
                <View style={styles.currentBalanceView}>
                    <Text style={styles.estimatedBalanceText}>
                        {mainText2}
                    </Text>
                    <Text style={styles.estimatedBalanceTextValue}>
                        R$ {cont.reduce((a: any, b: any) => a + b, 0)}
                    </Text>
                </View>
            </View>

            <View style={styles.mainContainer}>
                <ScrollView style={styles.scrollViewContainer}>
                    {earnings.map((earning, index) => {
                        return (
                            <TouchableOpacity style={styles.earningsItemView} onPress={showModal} key={index}>
                                <Feather name="dollar-sign" size={40} color={colorText} />
                                <View style={styles.earningTextView}>
                                    <Text style={[styles.earningTittleText, { color: colorText }]}>
                                        {earning.titulo}
                                        {earnings[index].id}
                                    </Text>
                                    <Text style={[styles.earningDateText, { color: colorText }]}>
                                        {earning.dia}/{earning.dtInicio}
                                    </Text>
                                </View>
                                {valuesList.map(value => {

                                    if (earnings[index].id == value.ganhos_id) {

                                        return (
                                            <Text style={[styles.earningValueText, { color: colorText }]}>R$ {value.valor}</Text>
                                        )
                                    }
                                })}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                    <LinearGradient
                        colors={['#FFFFFF', colorBorderFooter]}
                        start={{ x: -0.1, y: 0.1 }}
                        style={[styles.addNewButton, { borderColor: colorBorderAddButton }]}>
                        <TouchableOpacity style={[styles.addNewButton, { width: '100%', borderColor: colorBorderAddButton }]}
                            onPress={handleNavigateNovo}>
                            <Text style={[styles.addNewButtonText, { color: colorText }]}>
                                {TextAddButton}
                            </Text>
                            <Feather name="plus" size={40} color={colorText} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                <Footer item={item}></Footer>
            </View>

            <Modal animationType="slide" visible={modalVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(26, 130, 137, 0.33)', paddingBottom: 17, marginBottom: 37 }}>
                            <View style={styles.tittleView}>
                                <Text style={[styles.tittleText, { color: colorText }]}>Conta de Alguma Coisa</Text>
                                <TouchableOpacity>
                                    <Feather name="trash-2" size={20} color={colorText} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tittleView}>
                                <Text style={[styles.subTittleText, { color: colorText }]}>R$ 1.520,00</Text>
                                <Text style={[styles.subTittleText, { color: colorText }]}>15 Jul</Text>
                            </View>
                        </View>
                        <View style={styles.valuesList}>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                Ganho 1
                            </Text>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                R$ 500,00
                            </Text>
                        </View>
                        <View style={styles.valuesList}>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                Ganho 2
                            </Text>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                R$ 300,00
                            </Text>
                        </View>
                        <View style={styles.valuesList}>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                Ganho novo novissimo e importante e novo mesmo
                            </Text>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                R$ 15.500,00
                            </Text>
                        </View>
                        <View style={styles.valuesList}>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                Ganho 4
                            </Text>
                            <Text style={[styles.valuesListText, { color: colorText }]}>
                                R$ 500,00
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end", padding: 26 }}>
                            <TouchableOpacity style={[styles.plusButtonModal, { borderColor: colorBorderAddButton }]}>
                                <Feather name='plus' size={40} color={colorText} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerModal}>
                            <TouchableOpacity>
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
        maxHeight: 320,
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
