
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import { Feather} from '@expo/vector-icons'

import {useStylesStates} from '../../../contexts/stylesStates'

export default function ModalContent() {

    const {textModal, setModalBalance, modalBalance} = useStylesStates()
    
    return (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.questionsModalText}>
                  {textModal}
                </Text>
              <TouchableOpacity onPress={() => { setModalBalance(!modalBalance) }}>
                <Feather name="x" size={30} color={'#136065'} />
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    questionsModalText:{
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 22,
        marginHorizontal: 5,
        color: '#1A8289'
      },
      modalContent: {
        backgroundColor: '#fff',
        height: '50%',
        padding: 30,
        alignItems:'center',
        justifyContent:'center'
      },
})