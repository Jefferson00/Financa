
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal} from 'react-native';
import NumberFormat from 'react-number-format';
import { Feather, Ionicons } from '@expo/vector-icons'


export default function ModalContent() {
    let rec
    let atrasado = false



    return (
        <Modal animationType="slide" visible={false} transparent>
               
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: ' rgba(0, 0, 0, 0.39);',
        justifyContent: 'center'
      },
      modalContent: {
        backgroundColor: '#ffffff',
        height: '80%',
    },
      headerModal: {
        height: 75,
        borderBottomWidth: 1,
        borderBottomColor: '#1A828922',
        width: '100%',
        marginBottom:20,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 26,
        top: 0,
    },
    tittleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 26,
    },
    tittleText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
    },
    subTittleText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    valuesList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 26,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4',
        padding: 5,
        flexWrap: 'wrap',
    },
    valuesListText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
})