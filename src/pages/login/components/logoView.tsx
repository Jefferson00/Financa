import React from 'react';

import { StyleSheet, View, Text, Image } from "react-native";
import Logo from '../assets/logo.png'

export default function LogoView() {

    return (
        <View style={styles.imageContainer}>
            <Text style={styles.tittleText}>
                Login
            </Text>
            <Image
                source={Logo}
                style={styles.imageLogo}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer:{
        height:300,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgba(249, 207, 60, 0.19)',
        margin:28,
    },
    imageLogo:{
        flex: 1,
        width: 177,
        height: 214,
        resizeMode: 'contain'
    },
    tittleText:{
        color: '#1A8289',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        textAlign: 'center',
        marginTop:23,
    },
})