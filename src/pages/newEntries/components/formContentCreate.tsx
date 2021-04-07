import React, { useContext } from "react"
import { StyleSheet, Text, View, TextInput, Switch, Alert } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler"
import { NewEntriesContext } from "../../../contexts/newEntriesContext"
import { StylesContext } from "../../../contexts/stylesContext"
import { Feather} from '@expo/vector-icons'

import Functions from "../../../utils"

interface ValuesData{
    id:number,
    description: string,
    amount: number,
    monthly: boolean,
    frequency: number,
    entries_id: number,
}

export default function FormContentCreate() {

    const {entrieValuesBeforeCreate, 
           updateEntrieValuesBeforeCreate,
           removeValueBeforeCreate,
           handleDeleteEntrieValues
        } = useContext(NewEntriesContext)

    const {entriePrimaryColor, entrieSecondaryColor, colorScheme, isDarkTheme} = useContext(StylesContext)

    function removeValue(index:number, valueId: number){
        Alert.alert(
            "Remover",
            "Deseja mesmo remover?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        valueId == 0 ? removeValueBeforeCreate(index)
                        : handleDeleteEntrieValues(-1, valueId)
                        removeValueBeforeCreate(index)
                    }
                }
            ],
            { cancelable: false }
        );
    }

        
    return(
        <>
         {entrieValuesBeforeCreate.map((values:ValuesData, index:number) => {
            
                return (
                    <View style={[styles.valuesViewItem, 
                        (isDarkTheme || colorScheme == 'dark') && {backgroundColor:'#454545'}
                        ]} key={index}>
                        {index > 0 &&
                        <View style={styles.deleteButtonView}>
                            <TouchableOpacity onPress={()=> removeValue(index,values.id)}>
                                <Feather name="trash-2" size={20} color={"#CC3728"} />
                            </TouchableOpacity>
                        </View>
                        }
                        <View style={styles.valuesView}>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor },
                            (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                            ]}>
                                Descrição
                            </Text>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor},
                            (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                            ]}>
                                Valor
                            </Text>
                            
                        </View>
                        <View style={styles.valuesView}>
    
                            <TextInput
                                onChange={e => updateEntrieValuesBeforeCreate('description', index, e)}
                                value={values.description}
                                style={[styles.InputText, { width: 150 },
                                (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                                ]}
                                multiline={true}
                                maxLength={30}
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
                                    style={[styles.InputTextValue,
                                        (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                                    ]}
                                    maxLength={10}
                                />
                            </View>
    
                        </View>
                        <View style={styles.valuesView}>
                            <Text style={[styles.subTittleText, { color: entriePrimaryColor },
                            (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                            ]}>
                                Periodicidade
                            </Text>
                        </View>
                        <View style={styles.frequencyView}>
                            <Text style={[styles.secondColorText, { color: entrieSecondaryColor }]}>Mensal</Text>
                            <Switch
                                trackColor={{ false: '#d2d2d2', true: entriePrimaryColor }}
                                thumbColor={values.monthly ? entrieSecondaryColor : entriePrimaryColor}
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
                                style={[styles.InputText,
                                    (colorScheme == 'dark' || isDarkTheme) && {color: '#FFFFFF'}
                                ]}
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
        borderRadius:20,
    },
    tittleTextView: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formView: {
        marginHorizontal: 43
    },
    deleteButtonView:{
        justifyContent:'flex-end',
        flexDirection:'row'
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
        justifyContent: 'space-between',
        alignItems:'center'
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
