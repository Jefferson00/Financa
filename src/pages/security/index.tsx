import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useColorScheme, Text, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar';
import MenuFooter from '../components/menuFooter'
import { StylesContext } from '../../contexts/stylesContext';
import Header from './components/header';
import { SecurityContext } from '../../contexts/securityContext';
import ReactNativePinView from "react-native-pin-view"
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store';
import { ScrollView } from 'react-native-gesture-handler';

export default function Security() {
    const colorScheme = useColorScheme()
    const { isDarkTheme, entriePrimaryColor, entrieSecondaryColor } = useContext(StylesContext)
    const { isSecurityEnable, toggleSwitchSecurity, hasPin, savePin, getPin } = useContext(SecurityContext)

    let containerBgColor = "#ffffff"
    let fromBackgroundColor
    let toBackgroundColor
    let textColor: string
    let subTextColor
    ///colors schemes

    if (colorScheme == 'dark' || isDarkTheme) {
        containerBgColor = "#090909"
    } else {
        containerBgColor = "#ffffff"
    }

    if (colorScheme === "dark" || isDarkTheme) {
        fromBackgroundColor = '#0851A7'
        toBackgroundColor = '#0A0500'
        textColor = '#ffffff'
        subTextColor = "rgba(255, 255, 255, 0.6)"
    } else {
        fromBackgroundColor = '#FEBD1C'
        toBackgroundColor = '#FF981E'
        textColor = '#444444'
        subTextColor = "rgba(63, 61, 86, 0.8)"
    }

    const pinView = useRef<any>(null)
    const comparePinView = useRef<any>(null)
    const userPinView = useRef<any>(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [showComparePinView, setShowComparePinView] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [userPin, setUserPin] = useState("")
    const [isPinCorrect, setIsPinCorrect] = useState(false)
    const [comparePin, setComparePin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)
    
    const [showUserRemoveButton, setShowUserRemoveButton] = useState(false)
    const [showUserCompletedButton, setShowUserCompletedButton] = useState(false)

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
    }, [enteredPin, comparePin])

    useEffect(() => {
        if (userPin.length > 0) {
            setShowUserRemoveButton(true)
        } else {
            setShowUserRemoveButton(false)
        }
        if (userPin.length === 6) {
            setShowUserCompletedButton(true)
        } else {
            setShowUserCompletedButton(false)
        }
    }, [userPin])

    useEffect(() => {
        if (showComparePinView) {
            pinView.current.clearAll()
        } 
    }, [showComparePinView])

    function verifyPin() {
        if (enteredPin === comparePin) {
            alert('Senha definida co successo!')
            savePin(enteredPin)
            getPin()
            setComparePin('')
            setEnteredPin('')
            setIsPinCorrect(false)
            setShowComparePinView(false)
        } else {
            alert('Pin incorreto!')
        }
    }

    async function validatePin(){
        let result = await SecureStore.getItemAsync('SecurePin');
        if (userPin === result){
            setIsPinCorrect(true)
        }else{
            setIsPinCorrect(false)
            alert('Senha incorreta!')
        }
    }

    const LeftButton: React.FunctionComponent<any> = () => (
        <Ionicons name={"ios-backspace"} size={36} color={textColor} />
    )


    return (
        <LinearGradient colors={[fromBackgroundColor, toBackgroundColor]} start={{ x: -0.8, y: 0.1 }} style={styles.container}>
            <StatusBar style="light" translucent />

            <Header />

            {/*Container Principal*/}
            <View style={[styles.mainContainer, { backgroundColor: containerBgColor }]}>
                <ScrollView style={styles.mainContent}>
                    <View style={styles.itemContent}>
                        <View>
                            <Text style={[styles.itemContentText, { color: textColor }]}>
                                Proteção do aplicativo
                            </Text>
                            <Text style={[styles.itemContentSubText, { color: subTextColor }]}>
                                Usar senha para acessar o aplicativo?
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#d2d2d2', true: "#3C93F9" }}
                            thumbColor={isSecurityEnable ? "#2673CE" : "#efefef"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchSecurity}
                            value={isSecurityEnable}
                            style={{ marginTop: 15 }}
                        />
                    </View>
                    {!hasPin || isPinCorrect?
                        <>
                            {showComparePinView
                                ?
                                <Text style={[styles.itemContentText, { color: textColor, textAlign: 'center', marginTop: 35 }]}>
                                    Repita a senha
                                </Text>
                                :
                                <Text style={[styles.itemContentText, { color: textColor, textAlign: 'center', marginTop: 35 }]}>
                                    Defina um PIN de acesso!
                                </Text>
                            }
                        </>
                        :
                        <>
                        <Text style={[styles.itemContentText, { color: textColor, textAlign: 'center', marginTop: 35 }]}>
                            Insira a senha atual para alterar
                        </Text>
                        <ReactNativePinView
                                style={{ marginTop: 10 }}
                                inputSize={20}
                                ref={userPinView}
                                pinLength={6}
                                buttonSize={60}
                                onValueChange={value => setUserPin(value)}
                                buttonAreaStyle={{
                                    marginTop: 24,
                                }}
                                inputAreaStyle={{
                                    marginBottom: 24,
                                }}
                                inputViewEmptyStyle={{
                                    backgroundColor: "transparent",
                                    borderWidth: 1,
                                    borderColor: textColor,
                                }}
                                inputViewFilledStyle={{
                                    backgroundColor: textColor,
                                }}

                                buttonTextStyle={{
                                    color: textColor,
                                }}
                                onButtonPress={key => {
                                    if (key === "custom_left") {
                                        userPinView.current.clear()
                                    }
                                    if (key === "custom_right") {
                                        validatePin()
                                    }
                                }}
                                customLeftButton={showUserRemoveButton ? <LeftButton /> : undefined}
                                customRightButton={showUserCompletedButton ? <Ionicons name={"lock-open"} size={36} color={textColor} /> : undefined}
                            />
                        </>
                    }
                    {
                        showComparePinView ?
                            <ReactNativePinView
                                style={{ marginTop: 10 }}
                                inputSize={20}
                                ref={comparePinView}
                                pinLength={6}
                                buttonSize={60}
                                onValueChange={value => setComparePin(value)}
                                buttonAreaStyle={{
                                    marginTop: 24,
                                }}
                                inputAreaStyle={{
                                    marginBottom: 24,
                                }}
                                inputViewEmptyStyle={{
                                    backgroundColor: "transparent",
                                    borderWidth: 1,
                                    borderColor: textColor,
                                }}
                                inputViewFilledStyle={{
                                    backgroundColor: textColor,
                                }}

                                buttonTextStyle={{
                                    color: textColor,
                                }}
                                onButtonPress={key => {
                                    if (key === "custom_left") {
                                        comparePinView.current.clear()
                                    }
                                    if (key === "custom_right") {
                                        verifyPin()
                                    }
                                }}
                                customLeftButton={showRemoveButton ? <LeftButton /> : undefined}
                                customRightButton={showCompletedButton ? <Ionicons name={"lock-open"} size={36} color={textColor} /> : undefined}
                            />
                            :
                            !hasPin || isPinCorrect ?
                            <ReactNativePinView
                            style={{marginTop:10}}
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
                                borderColor: textColor,
                            }}
                            inputViewFilledStyle={{
                                backgroundColor: textColor,
                            }}
    
                            buttonTextStyle={{
                                color: textColor,
                            }}
                            onButtonPress={key => {
                                if (key === "custom_left") {
                                    pinView.current.clear()
                                }
                                if (key === "custom_right") {
                                    setShowComparePinView(true)
                                    console.log('jdvif')
                                }
                            }}
                            customLeftButton={showRemoveButton ?  <LeftButton/>: undefined}
                            customRightButton={showCompletedButton ? <Ionicons name={"lock-open"} size={36} color={textColor} /> : undefined}
                        />
                        :null
                    }
                </ScrollView>

                <MenuFooter />

            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },

    mainContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        marginHorizontal: 20,
        marginVertical: 30,
        borderRadius: 20,
    },
    itemContent: {
        borderBottomWidth: 1,
        borderBottomColor: "#d2d2d2",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 25,
        marginTop: 35,
        paddingBottom: 10,
    },
    itemContentText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
    itemContentSubText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
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
