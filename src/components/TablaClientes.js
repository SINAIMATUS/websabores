import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import BotonEliminarProducto from './BotonEliminarCliente.js';

const TablaClientes = ({ clientes, eliminarCliente }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Clientes</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Cédula</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Teléfono</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <ScrollView>
        {clientes.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.apellido}</Text>
            <Text style={styles.celda}>{item.cedula}</Text>
            <Text style={styles.celda}>{item.telefono}</Text>
            <Text style={styles.celda}>{item.edad}</Text>
            <View style={styles.celdaAcciones}>
              <BotonEliminarProducto id={item.id} eliminarCliente={eliminarCliente} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: 'stretch',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    alignItems: 'center',
  },
  encabezado: {
    backgroundColor: '#f0f0f0',
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default TablaClientes;