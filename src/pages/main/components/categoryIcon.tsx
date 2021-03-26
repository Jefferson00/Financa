import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from 'react-native'
import { Feather, Ionicons , FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

interface CategoryIconProps{
    category:string,
    type:string
}

export default function CategoryIcon(props: CategoryIconProps){
    console.log(props.category)
    return(
        <>
            {props.category == "food" && <Ionicons  name="restaurant" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "pay" && <FontAwesome5  name="money-bill-wave" size={20} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "house" && <Ionicons  name="home" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "transport" && <Ionicons  name="bus" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "transfer" && <MaterialCommunityIcons  name="bank-transfer" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "card" && <Ionicons  name="card-outline" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "education" && <Ionicons  name="school" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "recreation" && <FontAwesome5  name="theater-masks" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "comunication" && <FontAwesome5  name="phone" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "health" && <AntDesign  name="medicinebox" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "others" && <Ionicons  name="cash-outline" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
            {props.category == "" || props.category == undefined  || props.category == null && <Ionicons  name="cash-outline" size={24} color={props.type == 'Ganhos' ? '#136065' : '#CC3728'}/>}
        </>
    )

}