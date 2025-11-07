import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';

const FormularioProductos = ({
  nuevoProducto,
  manejoCambio,
  guardarProducto,
  actualizarProducto,
  modoEdicion
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? 'Actualizar Producto' : 'Registro de Producto'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder='Nombre del producto'
        value={nuevoProducto.Nombre}
        onChangeText={(texto) => manejoCambio('Nombre', texto)}
      />
      <TextInput
        style={styles.input}
        placeholder='Precio'
        value={String(nuevoProducto.Precio)}
        onChangeText={(texto) => manejoCambio('Precio', texto)}
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        placeholder='Descripcion'
        value={nuevoProducto.Descripcion}
        onChangeText={(texto) => manejoCambio('Descripcion', texto)}
      />

      <Button
        title={modoEdicion ? 'Actualizar' : 'Guardar'}
        onPress={modoEdicion ? actualizarProducto : guardarProducto}
      />
    </View>
  );
};

// 🎨 Estilos separados al final
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default FormularioProductos;
