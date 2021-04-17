import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation()

    return(
        <View style={styles.headerView}>
            <TouchableOpacity onPress={navigation.goBack}>
                <Feather name="arrow-left" size={40} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.title}>Segurança</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    headerView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:33,
        marginTop:20,
    },
    title:{
        color: '#ffffff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
    }
  })