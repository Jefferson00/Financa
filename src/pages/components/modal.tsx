
import React from 'react'
import { StyleSheet, Modal, View} from 'react-native';

import {useStylesStates} from '../../contexts/stylesStates'


export default function ModalBox({children}:{children:any}) {
    const {modalBalance} = useStylesStates()

    return (
        <>
            <Modal animationType="slide" visible={modalBalance} transparent>
                <View style={styles.modalContainer}>
                    {children}
                </View>
            </Modal>

        </>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: ' rgba(0, 0, 0, 0.39);',
        justifyContent: 'center'
      },
})