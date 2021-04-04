import React, { useContext } from "react"
import { View, StyleSheet, Text, Dimensions } from "react-native"
import {
    LineChart,
} from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import { DataBDContext } from "../../../contexts/dataBDContext";
import { MainContext } from "../../../contexts/mainContext";
import { StylesContext } from "../../../contexts/stylesContext";
import Functions from "../../../utils"

interface BalanceData{
    month:number,
    year:number,
    amount: number
}

export default function ChartView() {

    const {balances} = useContext(DataBDContext)
    const {colorScheme} = useContext(StylesContext)
    const {currentYear, currentMonth, seeBalanceValues} = useContext(MainContext)
    let balanceChart : number[]= [0,0,0,0]
    let months = ["Jan","Fec","Mar","Abr"]
    let backgroundColor = "#ffffff"
    let backgroundGradientFrom = "#3C93F9"
    let backgroundGradientTo = "#63A9FA"

    if(colorScheme == 'dark'){
        backgroundColor = "#ffffff"
        backgroundGradientFrom = "#17549B"
        backgroundGradientTo = "#17549B"
    }
 
    let indexOfFirstMonth = 0
    if (balances.length > 0){
        balances.map((bal, index)=>{
            if(bal.year == currentYear && bal.month == currentMonth){
                indexOfFirstMonth = index
            }
        })
        balanceChart = [
            Functions.chartNumber(balances[indexOfFirstMonth].amount),
            Functions.chartNumber(balances[indexOfFirstMonth+1].amount),
            Functions.chartNumber(balances[indexOfFirstMonth+2].amount),
            Functions.chartNumber(balances[indexOfFirstMonth+3].amount)
        ]  
        months = [
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth].month), 
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+1].month),
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+2].month),
            Functions.convertDtToStringMonth(balances[indexOfFirstMonth+3].month),
        ]      
    }

    

    return (
        <>
        {seeBalanceValues ?
            <ScrollView 
                horizontal
                disableScrollViewPanResponder
                style={{
                marginTop:23,
                maxHeight:115,
                marginHorizontal:26,
                //paddingLeft:20,
            }}>
                <LineChart
                    data={{
                        labels: months,
                        datasets: [
                            {
                                data: balanceChart
                            }
                        ]
                    }}
                    width={(Dimensions.get("screen").width-50)} // from react-native
                    height={115}
                    yAxisLabel="R$ "
                    //yLabelsOffset={5}
                    xLabelsOffset={-13}
                    segments={2}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: backgroundColor,
                        backgroundGradientFrom: backgroundGradientFrom,
                        backgroundGradientTo: backgroundGradientTo,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                        //height:95,
                        //width:(Dimensions.get("window").width)-10,

                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                            y:-5,
                            x:10
                        },
                        propsForBackgroundLines:{
                            x:10,
                        },
                        propsForVerticalLabels:{
                            dx:10,
                        },
                        propsForHorizontalLabels:{
                            dx:10,
                            fontSize:11,
                        },
                        
                    }}
                    bezier
                    withShadow={false}
                    
                    style={{
                        marginVertical: 0,
                        borderRadius: 20,
                        alignItems:'stretch',
                    
                    }}
                />
            </ScrollView>
        :
             <View style={[styles.censoredChart, 
                colorScheme == 'dark' ? 
                {backgroundColor:'rgba(247, 241, 241, 0.40)'} : 
                {backgroundColor:'rgba(247, 241, 241, 0.80)'}
              ]}/>
        }
        </>
    )
}

const styles = StyleSheet.create({
    censoredChart:{
        height:115,
        borderRadius: 20,
        marginTop:23,
        marginHorizontal:26,
        backgroundColor:'rgba(247, 241, 241, 0.80)',
    }
})