import React, { useEffect, useState, StyleSheet } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import FormularioClientes from '../components/FormularioClientes.js';
import ListaClientes from '../components/ListaClientes.js';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      <ListaClientes clientes={clientes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Clientes;