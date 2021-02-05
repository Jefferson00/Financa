import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View,  Alert } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';

import Footer from '../components/footer'
import Header from "../components/header"
import ModalContent from "./components/modalContent"
import Balance from "./components/balance"
import EntriesResults from "./components/entriesResults"
import ButtonNewEntrie from "./components/buttonNewEntrie"

import EntriesDB from '../../services/entriesDB'
import ValuesDB from '../../services/valuesDB';

import Functions from "../../functions"

import {useSelectedMonthAndYear} from '../../contexts/selectMonthAndYear'
import {useStylesStates} from '../../contexts/stylesStates'
import {useResultsDB} from "../../contexts/resultsDBStates"
import { EntriesValues, ValuesItemUpdate, ValuesValues } from '../../interfaces';


export default function Entries({ route }: { route: any }, { navigation }: { navigation: any }) {
    const navigationScreen = useNavigation()

    const {selectedMonth, selectedYear, setSelectedTotalValues} = useSelectedMonthAndYear();
    const {
        setMonthColor, 
        setModalVisible,  
        mainColor1,
        mainColor2,
        setColorBorderAddButton,
        setColorBorderFooter,
        setMainColor1,
        setTextReceived,
        setTittleTextColor,
        setMainText1,
        setTextAddButton,
        setTextAlert,
        setMainColor2,
        setMainText2, 
        setModalType

    } = useStylesStates();

    const {setEntries, entries, valuesList, setValuesList}  = useResultsDB();

    const [selectedId, setSelectedId] = useState(0) 
  
    const { item } = route.params

    let cont: any = []
    let cont2: any = []

    const todayDate = new Date()
    const currentDate = new Date()
    const CurrentMonth = todayDate.getMonth() + 1
    const CurrentYear = todayDate.getFullYear()

    function showModal(id: number, totalValues: number) {
        setModalVisible(true);
        setModalType("Entries")
        setSelectedId(id)
        setSelectedTotalValues(totalValues)
    }

    function handleNavigateNovo() {
        navigationScreen.navigate('NewEntries', { item: item , month: selectedMonth, year: selectedYear})
    }

    function handleNavigateNovoUpdate(id: number) {
        setModalVisible(false)
        navigationScreen.navigate('NewEntries', { item: item, idUpdate: id, month: selectedMonth, year: selectedYear })
    }


   async function verifyMonthly(id: number){
        let isMonthly = false
        await ValuesDB.allOrderByDate().then((res: any) =>{
            const vlr : any = res._array.filter((vl:any) => vl.id == id)
 
            if (vlr[0].dtEnd == 209912){
                isMonthly = true
            }
        }).catch(error =>{
            console.log("Error: "+error)
        })
        console.log(isMonthly)
        return isMonthly
    }

    function deleteMonthlyValue(id: number){
        valuesList.map((value:any, index:number)=>{
            if (value.id == id){
                const newDate = new Date()
                newDate.setMonth(parseInt(Functions.toMonthAndYear(value.dtStart).month)-1)
                newDate.setFullYear(parseInt(Functions.toMonthAndYear(value.dtStart).year))
                let newDtEnd
                if ((selectedMonth) < 10) {
                    newDtEnd = selectedYear.toString() + '0' + selectedMonth.toString()
                } else {
                    newDtEnd = selectedYear.toString() + selectedMonth.toString()
                }

                let contRep = Functions.toFrequency(parseInt(newDtEnd), value.dtStart)
                const vlObj = {
                    description: value.description,
                    amount: value.amount,
                    dtStart: value.dtStart,
                    dtEnd: Functions.setDtEnd(false,contRep,newDate),
                    entries_id: value.entries_id
                }
                ValuesDB.update(id, vlObj)
            }
        })
    }
    
    /* Função que deleta um item (Entrie) */
    function removeItem(id: number) {
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
                       {
                        EntriesDB.remove2(id).then(() => {
                            alert('removido!')
                            setEntries(entries.filter((ern:EntriesValues) => ern.id !== id))
                            setValuesList(valuesList.filter((vlu: ValuesValues) => vlu.entries_id !== id))
                            setModalVisible(false)
                        }).catch(err => {
                            console.log(err)
                        })
                       }
                }
            ],
            { cancelable: false }
        );
    }

     /* Função que deleta um valor*/
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
                        {
                            if(!verifyMonthly(id)){
                                ValuesDB.remove(id).then(res => {
                                    setValuesList(valuesList.filter((vls: any)=> vls.id !== id))
                                }).catch(err => {
                                    console.log(err)
                                })
                            }else{
                                deleteMonthlyValue(id)
                            }
                        }
                }
            ],
            { cancelable: false }
        );
    }

    /*Função que atualiza uma entrada como recebida/paga*/
    function updateReceived(selectedId:number){
        EntriesDB.findById(selectedId).then((res:any)=>{
            let obj = {
                title: res._array[0].title,
                day: res._array[0].day,
                dtStart:res._array[0].dtStart,
                dtEnd:res._array[0].dtEnd,
                monthly:res._array[0].monthly,
                received:true,
                type:res._array[0].type,
            }
            EntriesDB.update(selectedId, obj).then(res=>{
                alert("Pago!")
                setModalVisible(false)
                loadResults()
            }).catch(err=>{
                console.log(err)
            })
            //console.log('Obj: '+obj.title)
        })
    }

    function loadResults(){
            let firstDate
            if (selectedMonth < 10) {
                firstDate = selectedYear.toString() + '0' + selectedMonth.toString()
            } else {
                firstDate = selectedYear.toString() + selectedMonth.toString()
            }
            console.log("firstDate: "+firstDate)
           
            EntriesDB.findByDateOrderByDay(parseInt(firstDate)).then((res:any) => {
               setEntries(res._array.filter((entrie:EntriesValues) => entrie.type == item))
            }).catch(err => {
                console.log(err)
            })
            ValuesDB.findByDate(parseInt(firstDate)).then((res:any) => {
                //console.log(res)
                setValuesList(res._array)
            }).catch(err => {
                console.log(err)
            })
    }
    const isFocused = useIsFocused()

    useEffect(() => {
        
        if (item === 'Ganhos') {
            if (navigationScreen.isFocused()){
                console.log("Mes selecionado: "+selectedMonth)
                console.log("Ano: "+selectedYear)
                setMainColor1('#155F69')
                setMainColor2('#F9CF3C')
                setMainText1('Ganhos Atuais')
                setMainText2('Ganhos Estimados')
                setMonthColor('#FDDB63')
                setTittleTextColor('#1A8289')
                setColorBorderAddButton('#24DBBA')
                setColorBorderFooter('#1A828922')
                setTextAddButton('Adicionar Novo Ganho')
                setTextReceived('Esse ganho já foi recebido?')
                setTextAlert('Ganho não recebido!')
            }

        } else if (item === 'Despesas') {
            if (navigationScreen.isFocused()){
                setMainColor1('#CC3728')
                setMainColor2('#F9CF3C')
                setMainText1('Despesas Atuais')
                setMainText2('Despesas Estimadas')
                setMonthColor('#FFFFFF')
                setTittleTextColor('#CC3728')
                setColorBorderAddButton('#FF4835')
                setColorBorderFooter('#CC372822')
                setTextAddButton('Adicionar Nova Despesa')
                setTextReceived('Essa despesa já foi paga?')
                setTextAlert('Despesa não paga!')
            }
        }
        console.log('Refreshed!');
        loadResults()

    }, [isFocused])

    const props = {
        item,
        CurrentMonth,
        CurrentYear,
        selectedId,
        currentDate,
        todayDate,
        cont,
        cont2,
        removeItem,
        removeValue,
        updateReceived,
        handleNavigateNovoUpdate,
        handleNavigateNovo,
        showModal,
    }

    return (
        <LinearGradient
            colors={[mainColor1, mainColor2]}
            start={{ x: -0.4, y: 0.1 }}
            style={styles.container}>
            <StatusBar style="light" translucent />
            <Header props={props}></Header>
           
            <Balance props={props}></Balance>

            <View style={styles.mainContainer}>
                <EntriesResults props={props}></EntriesResults>

                <ButtonNewEntrie props={props}></ButtonNewEntrie>

                <Footer item={item}></Footer>
            </View>

    
            <ModalContent props={props}></ModalContent>         
 

        </LinearGradient>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
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
})
