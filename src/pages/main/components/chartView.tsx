import React, { useContext } from "react"
import { View, StyleSheet, Text, Dimensions } from "react-native"
import {
    LineChart,
} from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import { DataBDContext } from "../../../contexts/dataBDContext";
import { MainContext } from "../../../contexts/mainContext";
import Functions from "../../../utils"

interface BalanceData{
    month:number,
    year:number,
    amount: number
}

export default function ChartView() {

    const {balances} = useContext(DataBDContext)
    const {currentYear, currentMonth} = useContext(MainContext)
    let balanceChart : number[]= [0,0,0,0]
    let months = ["Jan","Fec","Mar","Abr"]
    let indexOfFirstMonth = 0
    if (balances.length > 0){
        balances.map((bal, index)=>{
            if(bal.year == currentYear && bal.month == currentMonth){
                indexOfFirstMonth = index
            }
        })
        balanceChart = [
            balances[indexOfFirstMonth].amount, 
            balances[indexOfFirstMonth+1].amount,
            balances[indexOfFirstMonth+2].amount,
            balances[indexOfFirstMonth+3].amount
        ]  
        months = [
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth].month), 
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+1].month),
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+2].month),
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+3].month),
        ]      
    }

    

    return (
        <ScrollView 
            horizontal
            disableScrollViewPanResponder
            style={{
            marginTop:23,
           maxHeight:110,
            marginHorizontal:26}}>
            <LineChart
                data={{
                    labels: months,
                    datasets: [
                        {
                            data: balanceChart
                        }
                    ]
                }}
                width={(Dimensions.get("window").width)} // from react-native
                height={110}
                yAxisLabel="R$"
                yLabelsOffset={0}
                xLabelsOffset={-20}
                segments={2}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#3C93F9",
                    backgroundGradientTo: "#63A9FA",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                    height:95,
                    width:(Dimensions.get("window").width)-15,
                    style: {
                        
                     
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726",
                        y:-10,
                        //x:30
                    },
                    propsForBackgroundLines:{
                        //x:30,
                    },
                    propsForVerticalLabels:{
                        //dx:30,
                    }
                }}
                bezier
                style={{
                    marginVertical: 0,
                    borderRadius: 20,
                    alignItems:'center',
                   
                }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({

})