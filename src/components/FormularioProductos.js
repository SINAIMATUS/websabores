import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const FormularioProductos = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const guardarProducto = async () => {
    try {
      await addDoc(collection(db, "Productos"), {
        Nombre: nombre,
        Precio: parseFloat(precio),
        Descripcion: descripcion,
      });
      setNombre('');
      setPrecio('');
      setDescripcion('');
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
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
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
    borderRadius: 5,
  },
});

export default FormularioProductos;