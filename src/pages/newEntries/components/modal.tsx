import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'


export default function SuccessModal({ props }: { props: any }) {


    return (
        <Modal animationType="slide" visible={props.successModal} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalTextView}>
                        {props.idUpdate == null ?
                            <Text style={styles.modalText}>
                                Cadastro realizado com sucesso!
                            </Text>
                            :
                            <Text style={styles.modalText}>
                                Atualizado com sucesso!
                            </Text>
                        }
                    </View>
                    <TouchableOpacity onPress={props.handleNavigateEntries} style={styles.modalButton}>
                        <Text style={[styles.tittleText, { color: "#fff" }]}>Ok</Text>
                    </TouchableOpacity>
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
    modalContent: {
        backgroundColor: '#fff',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 30,
    },
    modalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        borderTopWidth: 1,
        borderTopColor: '#d2d2d2',
        width: '100%'
    },
    modalTextView: {
        minHeight: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        color: '#136065',
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
    },
    tittleText: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
    },
})
