import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from 'react-native'
import { MaterialIcons, Ionicons , FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { StylesContext } from "../../../contexts/stylesContext"

interface CategoryIconProps{
    category:string,
    type:string
}

export default function CategoryIcon(props: CategoryIconProps){
    //console.log(props.category)
    const {colorScheme , isDarkTheme} = useContext(StylesContext)

    let expansesTextColor = ""
    let earningsTextColor = ""

    colorScheme == 'dark' || isDarkTheme ? expansesTextColor = '#C0C0C0' : expansesTextColor = '#3C93F9'
    colorScheme == 'dark' || isDarkTheme ? earningsTextColor = '#C0C0C0' : earningsTextColor = '#3C93F9'

    return(
        <>
            {props.category == "food" && <Ionicons  name="restaurant" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "pay" && <FontAwesome5  name="money-bill-wave" size={20} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "house" && <Ionicons  name="home" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "transport" && <Ionicons  name="bus" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "transfer" && <MaterialCommunityIcons  name="bank-transfer" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "card" && <Ionicons  name="card-outline" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "education" && <Ionicons  name="school" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "recreation" && <FontAwesome5  name="theater-masks" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "comunication" && <FontAwesome5  name="phone" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "health" && <AntDesign  name="medicinebox" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "others" && <MaterialIcons  name="monetization-on" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
            {props.category == "" || props.category == undefined  || props.category == null && <Ionicons  name="cash-outline" size={24} color={props.type == 'Ganhos' ? earningsTextColor : expansesTextColor}/>}
        </>
    )

}