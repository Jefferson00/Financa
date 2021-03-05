import React, { useContext } from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

import Functions from '../../../functions'

import { Feather } from '@expo/vector-icons'
import { NewEntriesContext } from "../../../contexts/newEntriesContext";
import { StylesContext } from "../../../contexts/stylesContext";


export default function FormContent() {

    const {showCalendar,
           calendarDate, 
           titleInputEntrie,
           isEnabledReceived,
           isEnabledMonthly,
           entrieFrequency,
           entrieValuesBeforeCreate,
           onChangeDate, 
           showDatepicker,
           setTitleInputEntrie,
           toggleSwitchReceived,
           toggleSwitchMonthly,
           increaseEntrieFrequency,
           decreaseEntrieFrequency,
           updateEntrieValuesBeforeCreate,
        } = useContext(NewEntriesContext)

        const {entriePrimaryColor, entrieSecondaryColor } = useContext(StylesContext)

    return (
        <>
            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                Título
            </Text>
            <TextInput
                onChangeText={text => setTitleInputEntrie(text)}
                value={titleInputEntrie}
                style={styles.InputText}
                maxLength={45}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                        Data de recebimento
                    </Text>
                    <View style={styles.dateView}>
                        <Text style={[styles.subTittleText, { color: entrieSecondaryColor }]} onPress={showDatepicker}>
                            {calendarDate.getDate()} / {Functions.convertDtToStringMonth(calendarDate.getMonth() + 1)}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                        Recebido
                    </Text>
                    <Switch
                        trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                        thumbColor={isEnabledReceived ? 'd2d2d2' : entriePrimaryColor}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchReceived}
                        value={isEnabledReceived}
                    />
                </View>
            </View>
            {showCalendar &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={calendarDate}
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                />
            }

            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                Periodicidade
            </Text>

            <View style={styles.frequencyView}>
                <Text style={[styles.secondColorText, { color: entrieSecondaryColor }]}>
                    Mensal
                </Text>
                <Switch
                    trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                    thumbColor={isEnabledMonthly ? 'd2d2d2' : entriePrimaryColor}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchMonthly}
                    value={isEnabledMonthly}
                />

                <Feather name='chevron-left' size={30}
                    onPress={decreaseEntrieFrequency} />

                <Text style={{ fontSize: 18 }}>
                     {entrieFrequency}
                </Text>

                <Feather name='chevron-right' size={30}
                    onPress={increaseEntrieFrequency}
                />
                <Text style={[styles.secondColorText, { color: entrieSecondaryColor }]}>
                    Vezes
                </Text>
            </View>

            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                Valor
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.secondColorText, { color: entrieSecondaryColor, marginRight: 10, fontSize: 18 }]}>
                    R$
                </Text>
                <TextInput
                    keyboardType='numeric'
                    style={styles.InputTextValue}
                    onChange={e => updateEntrieValuesBeforeCreate('amount', 0 , e)}
                    value={entrieValuesBeforeCreate[0].amount.toString()}
                />
            </View>


        </>
    )
}

const styles = StyleSheet.create({
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginTop: 13,
    },
    dateView: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        flexDirection: 'row'
    },
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 19,
    },
    secondColorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    InputText: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#d2d2d2',
        color: '#136065',
    },
    InputTextValue: {
        height: 40,
        color: '#136065',
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        width: '100%'
    },
})