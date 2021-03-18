import React from "react"
import { View, StyleSheet, Text, Dimensions } from "react-native"
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

export default function ChartView() {

    return (
        <View style={{
            marginTop:20,
            marginHorizontal:20}}>
            <LineChart
                data={{
                    labels: ["January", "February", "March", "April"],
                    datasets: [
                        {
                            data: [
                                150050,
                                50000,
                                200000,
                                300000,
                            ]
                        }
                    ]
                }}
                width={(Dimensions.get("window").width)-40} // from react-native
                height={120}
                yAxisLabel="R$"
                yLabelsOffset={-5}
                xLabelsOffset={-20}
                segments={2}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#3C93F9",
                    backgroundGradientFrom: "#3C93F9",
                    backgroundGradientTo: "#63A9FA",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    
                }}
                bezier
                style={{
                    marginVertical: 0,
                    borderRadius: 20,
            
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({

})