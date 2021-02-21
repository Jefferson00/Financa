import React, { useState } from 'react';


import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { FontAwesome } from '@expo/vector-icons'

import LogoView from './components/logoView'
import UserDB from '../../services/userDB'
import firebase from '../../services/firebaseDB'

import {useUserDB} from '../../contexts/auth'

import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function Login() {
    const navigation = useNavigation()
    const {setUser, setIsLogged} = useUserDB()

    const [emailInputIsFocused, setEmailInputIsFocused] = useState(false)
    const [passwordInputIsFocused, setPasswordInputIsFocused] = useState(false)

    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const [seePassword, setSeePassword] = useState(false)

    function handleSignUp(){
        navigation.navigate('SignUp')
    }

    async function save(key:any, value:any) {
        await SecureStore.setItemAsync(key, value);
    }

    function storeEmail(userId:number, email:string) {
        firebase
          .database()
          .ref('users/' + userId)
          .set({
            email: email,
          });
      }

    async function LoginFirebase(email:string, password:string) {
        const user = await firebase.auth().signInWithEmailAndPassword(email,password)
        console.log(user)
    }

    function handleLogin(){
        if(inputEmail){
            UserDB.findUser(inputEmail).then((res:any)=>{
                console.log(res._array)
                if (inputPassword == res._array[0].password){
                    const cred = JSON.stringify({inputEmail, inputPassword})
                    save('credentials', cred ).then(()=>{
                        setIsLogged(true)
                        setUser(res._array)
                        LoginFirebase(res._array[0].email, res._array[0].password)
                    })
                }
            }).catch(err=>{
                alert('usuario não encontrado')
            })
        }
        
    }

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
                                onChangeText={inputEmail => setInputEmail(inputEmail)}
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
                                    secureTextEntry={!seePassword}
                                    onChangeText={password => setInputPassword(password)}
                                />
                                <TouchableOpacity style={styles.seePasswordButton} 
                                    onPress={()=> setSeePassword(previousState => !previousState)}>
                                    {!seePassword?
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

                        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.toSignUpView}>
                            <Text style={styles.formLabel}>
                                Não tem cadastro?
                            </Text>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleSignUp}>
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