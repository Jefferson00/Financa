import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { StylesContext } from '../../contexts/stylesContext';

export default function Header() {

  const {monthColor} = useContext(StylesContext)

  return (
    <View style={styles.monthView}>
      <TouchableOpacity>
        <Feather name="chevron-left" size={40} color={monthColor} />
      </TouchableOpacity>
      <Text style={[styles.monthText, { color: monthColor }]}>
          Nov 2020
      </Text>
      <TouchableOpacity>
        <Feather name="chevron-right" size={40} color={monthColor} />
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  monthView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 13,
  },
  monthText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginHorizontal: 5
  },
})