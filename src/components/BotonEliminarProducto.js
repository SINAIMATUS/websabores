import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const BotonEliminarProducto = ({ id, eliminarProducto }) => {
  const [visible, setVisible] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const eliminarProductoId = () => {
    setVisible(false);
    if (confirmarEliminar) {
      eliminarProducto(id);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>X</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>¿Desea eliminar este producto?</Text>
            <View style={styles.fila}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmarEliminar(false);
                  setVisible(false);
                }}
              >
                <Text style={styles.textoAccionCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmarEliminar(true);
                  eliminarProductoId();
                }}
              >
                <Text style={styles.textoAccionEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBoton: {
    color: "#FF3737FF",
    fontSize: 14,
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
      backgroundColor: "white",
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    titulo: {
      fontSize: 18,
      marginBottom: 20,
    },
    fila: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    botonAccion: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 5,
      alignItems: "center",
    },
    cancelar: {
      backgroundColor: "#ccc",
      confirm: {
        backgroundColor: "#ff4040",
        textoAccion: {
          color: "white",
          fontWeight: "bold",
        },
      },
    },
  }
});

export default BotonEliminarProducto;