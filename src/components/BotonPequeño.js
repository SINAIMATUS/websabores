import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BotonPequeño = ({ titulo, onPress }) => (
  <TouchableOpacity style={styles.boton} onPress={onPress}>
    <Text style={styles.texto}>{titulo}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#6200ee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 4,
    alignSelf: 'flex-start', // para que no ocupe todo el ancho
  },
  texto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BotonPequeño;