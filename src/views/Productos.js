import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import FormularioProductos from '../components/FormularioProductos.js';
import ListaProductos from '../components/ListaProductos.js';
import TablaProductos from '../components/TablaProductos.js';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';

const Productos = () => {
  // 🟡 Estados
  const [listaProductos, setListaProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre: "",
    Precio: "",
    Descripcion: ""
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  // 🔵 Función para cargar productos desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListaProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

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

  // 🟢 Guardar nuevo producto
  const guardarProducto = async () => {
    try {
      if (nuevoProducto.Nombre && nuevoProducto.Precio && nuevoProducto.Descripcion) {
        await addDoc(collection(db, "Productos"), {
          Nombre: nuevoProducto.Nombre,
          Precio: parseFloat(nuevoProducto.Precio),
          Descripcion: nuevoProducto.Descripcion
        });

        alert("Producto agregado correctamente ✅");
        cargarDatos();
        setNuevoProducto({ Nombre: "", Precio: "", Descripcion: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  // 🟠 Actualizar producto existente
  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.Nombre && nuevoProducto.Precio && nuevoProducto.Descripcion) {
        await updateDoc(doc(db, "Productos", productoId), {
          Nombre: nuevoProducto.Nombre,
          Precio: parseFloat(nuevoProducto.Precio),
          Descripcion: nuevoProducto.Descripcion
        });

        alert("Producto actualizado correctamente ✅");
        cargarDatos();
        setNuevoProducto({ Nombre: "", Precio: "", Descripcion: "" });
        setModoEdicion(false);
        setProductoId(null);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  // 🟣 Cargar datos al formulario para editar
  const editarProducto = (producto) => {
    setNuevoProducto({
      Nombre: producto.Nombre,
      Precio: String(producto.Precio),
      Descripcion: producto.Descripcion,
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  // 🔴 Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos();
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
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      <ListaProductos productos={listaProductos} />
      <TablaProductos
        productos={listaProductos}
        editarProducto={editarProducto}
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
