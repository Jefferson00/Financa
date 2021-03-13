import React, { useContext } from "react"
import { StyleSheet, Text, View, TextInput, Switch } from 'react-native'
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import { StylesContext } from "../../../contexts/stylesContext"

import Functions from "../../../utils"

interface ValuesData{
    description: string,
    amount: number,
    monthly: boolean,
    frequency: number,
    entries_id: number,
}

export default function FormContentCreate() {

    const {entrieValuesBeforeCreate, 
           updateEntrieValuesBeforeCreate,
           isEnabledMonthly,
        } = useContext(NewEntriesContext)

    const {entriePrimaryColor, entrieSecondaryColor} = useContext(StylesContext)

        
    return(
        <>
         {entrieValuesBeforeCreate.map((values:ValuesData, index:number) => {
            
                return (
                    <View style={styles.valuesViewItem} key={index}>
                        <View style={styles.valuesView}>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                Descrição
                            </Text>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor}]}>
                                Valor
                            </Text>
                        </View>
                        <View style={styles.valuesView}>
    
                            <TextInput
                                onChange={e => updateEntrieValuesBeforeCreate('description', index, e)}
                                value={values.description}
                                style={[styles.InputText, { width: 150 }]}
                                multiline={true}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:10}}>
                                <Text style={[styles.secondColorText, { color: entrieSecondaryColor, marginRight: 10, fontSize: 18 }]}>
                                    R$
                                </Text>
                                <TextInput
                                    keyboardType='numeric'
                                    placeholder='R$ 0,00'
                                    onChange={e => updateEntrieValuesBeforeCreate('amount', index, e)}
                                    value={Functions.formatCurrency(values.amount)}
                                    style={styles.InputTextValue}
                                    maxLength={10}
                                />
                            </View>
    
                        </View>
                        <View style={styles.valuesView}>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor }]}>
                                Periodicidade
                            </Text>
                        </View>
                        <View style={styles.frequencyView}>
                            <Text style={[styles.secondColorText, { color: entrieSecondaryColor }]}>Mensal</Text>
                            <Switch
                                trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                                thumbColor={values.monthly ? 'd2d2d2' : entriePrimaryColor}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={e=> updateEntrieValuesBeforeCreate('monthly', index, e)}
                                value={values.monthly}
                            />
                          
                          {values.monthly ?
                            <Text> - </Text>
                            :
                            <TextInput
                                onChange={e => updateEntrieValuesBeforeCreate('frequency', index, e)}
                                value={values.frequency.toString()}
                                style={styles.InputText}
                                keyboardType='numeric'
                                maxLength={2}
                            />
                          }
    
                            <Text style={[styles.secondColorText, { color: entrieSecondaryColor }]}>Vezes</Text>
                        </View>
                    </View>
                )
            })}
            </>
    )
    
}

const styles = StyleSheet.create({
    valuesViewItem: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 15,
        paddingVertical: 5,
        paddingBottom: 10,
        justifyContent: 'center',
        marginBottom: 10,
        borderColor: '#eaeaea',
        borderWidth: 1,
    },
    tittleTextView: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formView: {
        marginHorizontal: 43
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
        width:'100%'
    },
    
    frequencyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 19,
    },

    valuesView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
  
    subTittleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginTop: 13,
    },

    secondColorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },

})
