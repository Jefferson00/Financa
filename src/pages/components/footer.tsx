import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Feather} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

export default function Footer({item}:{item:string}){
    const navigation = useNavigation()
    
    const [colorBorderFooter, setColorBorderFooter] = useState('#fff')
    const [colorIcons, setColorIcons] = useState('#fff')

    useEffect(() =>{
        if(item==='Ganhos'){
            setColorBorderFooter('#1A828922')
            setColorIcons('#1A8289')
        }
        else if(item==='Despesas'){
            setColorBorderFooter('#CC372822')
            setColorIcons('#CC3728')
        }
    })

    return(
        <View style={[styles.footer,{borderTopColor:colorBorderFooter}]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={30} color={colorIcons} />
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        height: 61,
        borderTopWidth: 1,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 26,
    }
})