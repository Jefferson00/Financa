import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'

export default function Header() {



  return (
    <View style={styles.monthView}>
      <TouchableOpacity>
        <Feather name="chevron-left" size={40} color={'#1A8289'} />
      </TouchableOpacity>
      <Text style={[styles.monthText, { color: '#1A8289' }]}>
          Nov 2020
      </Text>
      <TouchableOpacity>
        <Feather name="chevron-right" size={40} color={'#1A8289'} />
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