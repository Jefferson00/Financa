import React, { useState } from 'react';

import { StyleSheet, View, Text, Image, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { StatusBar } from 'expo-status-bar';

import { FontAwesome } from '@expo/vector-icons'

import LogoView from './components/logoView'

import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function Login() {

    const [emailInputIsFocused, setEmailInputIsFocused] = useState(false)
    const [passwordInputIsFocused, setPasswordInputIsFocused] = useState(false)

    const [seePassword, setSeePassword] = useState(false)

    return (
        <>
            <KeyboardAvoidingView
                //behavior={Platform.OS === "ios" ? "padding" : "height"}
                behavior={Platform.select({ android: 'height', ios: 'padding' })}
                keyboardVerticalOffset={Header.height + 80}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <StatusBar style="dark" translucent />

                    <LogoView></LogoView>

                    <View style={styles.formLogin}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                E-mail
                        </Text>
                            <TextInput
                                style={[styles.formTextInput, emailInputIsFocused && { borderColor: '#1A8289' }]}
                                onFocus={() => setEmailInputIsFocused(true)}
                                onBlur={() => setEmailInputIsFocused(false)}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                Senha
                        </Text>
                            <View style={[styles.formPasswordInput, passwordInputIsFocused && { borderColor: '#1A8289' }]}>
                                <TextInput
                                    style={{width:'80%'}}
                                    onFocus={() => setPasswordInputIsFocused(true)}
                                    onBlur={() => setPasswordInputIsFocused(false)}
                                    secureTextEntry={seePassword}
                                />
                                <TouchableOpacity style={styles.seePasswordButton} 
                                    onPress={()=> setSeePassword(previousState => !previousState)}>
                                    {seePassword?
                                         <FontAwesome name="eye" size={24} color="black" />
                                         :
                                         <FontAwesome name="eye-slash" size={24} color="black" />
                                    }
                                </TouchableOpacity>

                            </View>
                        </View>
                        <TouchableOpacity style={{ padding: 10, alignItems: 'flex-end' }}>
                            <Text style={styles.formLabel}>
                                Esqueci minha senha
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonLogin}>
                            <Text style={styles.buttonText}>
                                Entrar
                        </Text>
                        </TouchableOpacity>

                        <View style={styles.toSignUpView}>
                            <Text style={styles.formLabel}>
                                Não tem cadastro?
                        </Text>
                            <TouchableOpacity style={{ marginLeft: 5 }}>
                                <Text style={styles.formLinkText}>
                                    Crie uma conta
                            </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.socialLogin}>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4A39' }]}>
                                <FontAwesome name="google" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3B5998' }]}>
                                <FontAwesome name="facebook-f" size={24} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
    },
    formLogin: {
        marginHorizontal: 24,
    },
    formGroup: {
        marginTop: 11,
    },
    formLabel: {
        fontSize: 12,
        color: '#808080',
        fontFamily: 'Poppins_500Medium',
        paddingLeft: 20,
    },
    formTextInput: {
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#d2d2d2',
        color: '#136065',
        width: '100%',
        marginTop: 8,
        paddingLeft: 20,
    },
    formPasswordInput:{
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#d2d2d2',
        color: '#136065',
        width: '100%',
        marginTop: 8,
        paddingLeft: 20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    buttonLogin: {
        backgroundColor: '#1a8289',
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
    },
    toSignUpView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    formLinkText: {
        color: '#1A8289',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
    },
    socialLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    socialButton: {
        backgroundColor: '#d2d2d2',
        borderRadius: 50,
        height: 38,
        width: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 13,
        marginVertical: 40,
    },
    seePasswordButton: {
       marginRight:20,
       width:30,
    }
})