import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const FormularioProductos = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const guardarProducto = async () => {
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nombre,
        precio: parseFloat(precio),
      });
      setNombre('');
      setPrecio('');
      alert('Producto agregado con éxito');
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar el producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button title="Guardar" onPress={guardarProducto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default FormularioProductos;