import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from 'react-native'
import { Feather, Ionicons , FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

interface CategoryIconProps{
    category:string,
    opacColor:string
}

export default function CategoryIcon(props: CategoryIconProps){
    console.log(props.category)
    return(
        <>
            {props.category == "food" && <Ionicons  name="restaurant" size={40} color={props.opacColor}/>}
            {props.category == "pay" && <FontAwesome5  name="money-bill-wave" size={40} color={props.opacColor}/>}
            {props.category == "house" && <Ionicons  name="home" size={40} color={props.opacColor}/>}
            {props.category == "transport" && <Ionicons  name="bus" size={40} color={props.opacColor}/>}
            {props.category == "transfer" && <MaterialCommunityIcons  name="bank-transfer" size={40} color={props.opacColor}/>}
            {props.category == "card" && <Ionicons  name="card-outline" size={40} color={props.opacColor}/>}
            {props.category == "education" && <Ionicons  name="school" size={40} color={props.opacColor}/>}
            {props.category == "recreation" && <FontAwesome5  name="theater-masks" size={40} color={props.opacColor}/>}
            {props.category == "comunication" && <FontAwesome5  name="phone" size={40} color={props.opacColor}/>}
            {props.category == "health" && <AntDesign  name="medicinebox" size={40} color={props.opacColor}/>}
            {props.category == "others" && <Ionicons  name="cash-outline" size={40} color={props.opacColor}/>}
            {props.category == "" || props.category == undefined && <Ionicons  name="cash-outline" size={40} color={props.opacColor}/>}
        </>
    )

}