import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import FormularioProductos from '../components/FormularioProductos.js';
import ListaProductos from '../components/ListaProductos.js';
import TablaProductos from '../components/TablaProductos.js';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';

const Productos = () => {
  // 🟡 Estados
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre: "",
    Precio: "",
    Descripcion: ""
  });

  // 🔵 Función para cargar productos desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  // 🔵 useEffect para cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // 🟢 Función para manejar cambios en el formulario
  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  // 🟢 Función para guardar un nuevo producto
  const guardarProducto = async () => {
    try {
      if (
        nuevoProducto.Nombre &&
        nuevoProducto.Precio &&
        nuevoProducto.Descripcion 
      ) {
        await addDoc(collection(db, "Productos"), {
          Nombre: nuevoProducto.Nombre,
          Precio: parseFloat(nuevoProducto.Precio),
          Descripcion: nuevoProducto.Descripcion
        });

        alert("Producto agregado correctamente :D");

        cargarDatos(); // Recargar lista
        setNuevoProducto({ Nombre: "", Precio: "", Descripcion: "" })
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  // 🔴 Función para eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // ⚪ Renderizado
  return (
    <View style={styles.container}>
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
      />
      <ListaProductos productos={productos} />
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
});

export default Productos;
