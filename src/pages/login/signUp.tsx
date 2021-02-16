import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';

import { FontAwesome } from '@expo/vector-icons'

import LogoView from './components/logoView'
import UserDB from '../../services/userDB'

import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function SignUp() {
    const navigation = useNavigation()
    const [nameInputIsFocused, setNameInputIsFocused] = useState(false)
    const [emailInputIsFocused, setEmailInputIsFocused] = useState(false)
    const [passwordInputIsFocused, setPasswordInputIsFocused] = useState(false)
    const [passwordConfirInputIsFocused, setPasswordConfirInputIsFocused] = useState(false)

    const [seePassword, setSeePassword] = useState(false)
    const [seeConfirPassword, setSeeConfirPassword] = useState(false)

    const [inputName, setInputName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')


    function handleCreateUser(){
        
        let validateInputs 

        if (inputPassword === inputPasswordConfirm){
            validateInputs = true
        }else{
            validateInputs = false
            alert('A senha não corresponde')
        }
        if (inputEmail){
            validateInputs = true
        }else{
            validateInputs = false
            alert('O E-mail é obrigatorio')
        }

        if (validateInputs){
            const userObj = {
                name : inputName,
                email: inputEmail,
                password: inputPassword,
                image: ''
            }
            UserDB.create(userObj).then(res=>{
                alert('usuario criado com sucesso')
            }).catch(err=>{
                console.log(err)
            })
            console.log('USER: '+userObj.email)
        }

        UserDB.findAll().then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <KeyboardAvoidingView
            //behavior={Platform.OS === "ios" ? "padding" : "height"}
            behavior={Platform.select({ android: 'height', ios: 'padding' })}
            keyboardVerticalOffset={Header.height + 80}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <StatusBar style="dark" translucent />

                <ScrollView>
                    <LogoView></LogoView>

                    <View style={styles.formLogin}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                               Nome
                            </Text>
                            <TextInput
                                style={[styles.formTextInput, nameInputIsFocused && { borderColor: '#1A8289' }]}
                                onFocus={() => setNameInputIsFocused(true)}
                                onBlur={() => setNameInputIsFocused(false)}
                                onChangeText={inputName => setInputName(inputName)}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                E-mail
                            </Text>
                            <TextInput
                                style={[styles.formTextInput, emailInputIsFocused && { borderColor: '#1A8289' }]}
                                onFocus={() => setEmailInputIsFocused(true)}
                                onBlur={() => setEmailInputIsFocused(false)}
                                onChangeText={inputEmail => setInputEmail(inputEmail)}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                Senha
                            </Text>
                            <View style={[styles.formPasswordInput, passwordInputIsFocused && { borderColor: '#1A8289' }]}>
                                <TextInput
                                    style={{ width: '80%' }}
                                    onFocus={() => setPasswordInputIsFocused(true)}
                                    onBlur={() => setPasswordInputIsFocused(false)}
                                    secureTextEntry={!seePassword}
                                    onChangeText={password => setInputPassword(password)}
                                />
                                <TouchableOpacity style={styles.seePasswordButton}
                                    onPress={() => setSeePassword(previousState => !previousState)}>
                                    {!seePassword ?
                                        <FontAwesome name="eye" size={24} color="black" />
                                        :
                                        <FontAwesome name="eye-slash" size={24} color="black" />
                                    }
                                </TouchableOpacity>

                            </View>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                Confirmar Senha
                            </Text>
                            <View style={[styles.formPasswordInput, passwordConfirInputIsFocused && { borderColor: '#1A8289' }]}>
                                <TextInput
                                    style={{ width: '80%' }}
                                    onFocus={() => setPasswordConfirInputIsFocused(true)}
                                    onBlur={() => setPasswordConfirInputIsFocused(false)}
                                    secureTextEntry={!seeConfirPassword}
                                    onChangeText={confirmPassword => setInputPasswordConfirm(confirmPassword)}
                                />
                                <TouchableOpacity style={styles.seePasswordButton}
                                    onPress={() => setSeeConfirPassword(previousState => !previousState)}>
                                    {!seeConfirPassword ?
                                        <FontAwesome name="eye" size={24} color="black" />
                                        :
                                        <FontAwesome name="eye-slash" size={24} color="black" />
                                    }
                                </TouchableOpacity>

                            </View>
                        </View>

                        <TouchableOpacity style={styles.buttonLogin} onPress={handleCreateUser}>
                            <Text style={styles.buttonText}>
                                Cadastrar
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.toSignUpView}>
                            <Text style={styles.formLabel}>
                                Já possui cadastro?
                            </Text>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={navigation.goBack}>
                                <Text style={styles.formLinkText}>
                                    Entrar
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
                </ScrollView>

            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    formPasswordInput: {
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#d2d2d2',
        color: '#136065',
        width: '100%',
        marginTop: 8,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonLogin: {
        backgroundColor: '#1a8289',
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:50,
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
        marginRight: 20,
        width: 30,
    }
})