import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Image, Text, Switch, Alert } from 'react-native';
import { SecurityContext } from '../../../contexts/securityContext';
import LogoImage from '../../../../assets/logo.png'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReactNativePinView from "react-native-pin-view"
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store';

export default function SecurityAccess() {
    const {updateAccess, isScanned, handleAuthentication, getPin } = useContext(SecurityContext)
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)
    useEffect(() => {
        if (enteredPin.length > 0) {
            setShowRemoveButton(true)
        } else {
            setShowRemoveButton(false)
        }
        if (enteredPin.length === 6) {
            setShowCompletedButton(true)
        } else {
            setShowCompletedButton(false)
        }
    }, [enteredPin])

    async function verifyAccess(){
        let result = await SecureStore.getItemAsync('SecurePin');
        if (enteredPin === result){
            updateAccess()
        }else{
            alert('Pin incorreto!')
        }
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.ImageView}
                source={LogoImage}
            />
            <ReactNativePinView
                inputSize={20}
                ref={pinView}
                pinLength={6}
                buttonSize={60}
                onValueChange={value => setEnteredPin(value)}
                buttonAreaStyle={{
                    marginTop: 24,
                }}
                inputAreaStyle={{
                    marginBottom: 24,
                }}
                inputViewEmptyStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#FFF",
                }}
                inputViewFilledStyle={{
                    backgroundColor: "#FFF",
                }}

                buttonTextStyle={{
                    color: "#FFF",
                }}
                onButtonPress={key => {
                    if (key === "custom_left") {
                        pinView.current.clear()
                    }
                    if (key === "custom_right") {
                        verifyAccess()
                    }
                }}
                customLeftButton={showRemoveButton ? <Ionicons name={"ios-backspace"} size={36} color={"#FFF"} /> : undefined}
                customRightButton={showCompletedButton ? <Ionicons name={"lock-open"} size={36} color={"#FFF"} /> : undefined}
            />
            <TouchableOpacity style={styles.button} onPress={() => !isScanned && handleAuthentication()}>
                <Ionicons name={"finger-print"} size={40} color={'#ffffff'}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#2F81E1'
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageView: {
        width: 126,
        height: 157,
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
