import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import BotonEliminarProducto from './BotonEliminarProducto.js';

const TablaProductos = ({ productos, editarProducto, eliminarProducto }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Productos</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Descripción</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Precio</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <ScrollView>
        {productos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.Nombre}</Text>
            <Text style={styles.celda}>{item.Descripcion}</Text>
            <Text style={styles.celda}>{item.Precio}</Text>
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarProducto(item)}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
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
    padding: 10,
    alignSelf: 'stretch',
  },
  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 7,
    textAlign: 'center',
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#bb036832',
    paddingVertical: 8,
    alignItems: 'center',
  },
  encabezado: {
    backgroundColor: '#bb036832',
  },
  celda: {
    flex: 1,
    fontSize: 9,
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
    fontSize: 8,
    textAlign: 'center',
  },
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f7"
  }
});

export default TablaProductos;