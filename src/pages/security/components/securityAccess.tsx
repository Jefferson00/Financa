import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Image, Text, Switch } from 'react-native';
import { SecurityContext } from '../../../contexts/securityContext';
import SplashImage from '../../../../assets/splash.png'

export default function SecurityAccess() {
    const { isSecurityEnable, toggleSwitchSecurity } = useContext(SecurityContext)




    return (
        <View style={styles.container}>
            <Image
                style={styles.ImageView}
                source={SplashImage}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },
    ImageView:{
        flex:1,
        width:"100%",
        height:"100%",
    },
    mainContant: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        marginHorizontal: 20,
        marginVertical: 30,
        borderRadius: 20,
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 21,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        justifyContent: 'flex-start'
    },
});
