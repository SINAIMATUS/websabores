import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import BotonEliminarCliente from './BotonEliminarCliente';


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
            <Text style={styles.celda}>{item.Nombre}</Text>
            <Text style={styles.celda}>{item.Apellido}</Text>
            <Text style={styles.celda}>{item.Cedula}</Text>
            <Text style={styles.celda}>{item.Telefono}</Text>
            <Text style={styles.celda}>{item.Edad}</Text>
            <View style={styles.celdaAcciones}>
              <BotonEliminarCliente id={item.id} eliminarCliente={eliminarCliente} />
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
    padding: 1,
    alignSelf: 'stretch',
  },
  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderColor: '#ccc',
    paddingVertical: 6,
    alignItems: 'center',
  },
  encabezado: {
    backgroundColor: '#f0f0f0',
  },
  celda: {
    flex: 1,
    fontSize: 8,
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
    fontSize: 7,
    textAlign: 'center',
  },
});

export default TablaClientes;