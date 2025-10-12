import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import FormularioClientes from '../components/FormularioClientes.js';
import ListaClientes from '../components/ListaClientes.js';
import TablaClientes from '../components/TablaClientes.js';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarCliente= async (id) => {
    try {
      await deleteDoc(doc(db, "Clientes", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      <ListaClientes clientes={clientes} />
      <TablaClientes
        Clientes={Clientes}
        eliminarCliente={eliminarCliente}
      />
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