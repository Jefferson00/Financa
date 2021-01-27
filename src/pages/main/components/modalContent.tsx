
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';


import { Feather } from '@expo/vector-icons'

import { useStylesStates } from '../../../contexts/stylesStates'

export default function ModalContent() {

  const { textModal, setModalBalance, modalBalance } = useStylesStates()


  return (

    <Modal animationType="slide" visible={modalBalance} transparent>
      <View style={styles.modalContainer}>
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
      </View>
    </Modal>

  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: ' rgba(0, 0, 0, 0.39);',
    justifyContent: 'center'
  },
  questionsModalText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    marginHorizontal: 5,
    color: '#1A8289'
  },
  modalContent: {
    backgroundColor: '#fff',
    height: '50%',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
})