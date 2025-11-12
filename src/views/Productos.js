import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, QuerySnapshot, orderBy, limit, query, where } from "firebase/firestore";
import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import BotonPequeño from "../components/BotonPequeño";

const Productos = ({ cerrarSesion }) => {

  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const colecciones = ["Productos", "Clientes", "Ciudades"];

  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre: "",
    Precio: "",
    Descripcion: "",
  });


  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.Nombre && nuevoProducto.Precio && nuevoProducto.Descripcion) {
        await addDoc(collection(db, "Productos"), {
          nombre: nuevoProducto.Nombre,
          precio: parseFloat(nuevoProducto.Precio),
          descripcion: nuevoProducto.Descripcion,
        });
        cargarDatos(); // Recargar lista
        setNuevoProducto({ Nombre: "", Precio: "", Descripcion: "" });
        alert("Producto agregado");
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };


  //Nuevas importaciones 
  const cargarDatosFirebaseCompletos = async (Productos) => {
    try {
      const datosExportados = {};
      for (const col of colecciones) {
        const snapshot = await getDocs(collection(db, col));
        datosExportados[col] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      return datosExportados;
    } catch (error) {
      console.error("Error extrayendo datos: ", error);
    }
  };

  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.Nombre && nuevoProducto.Precio && nuevoProducto.Descripcion) {
        await updateDoc(doc(db, "Productos", productoId), {
          nombre: nuevoProducto.Nombre,
          precio: parseFloat(nuevoProducto.Precio),
          descripcion: nuevoProducto.Descripcion,
        });
        setNuevoProducto({ Nombre: "", Precio: "", Descripcion: "" });
        setModoEdicion(false); // Volver al modo registro
        setProductoId(null);
        cargarDatos(); // Recargar lista
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  //Segunda importación
  const exportarDatos = async () => {
    try {
      const datos = await cargarDatosFirebaseCompletos();
      console.log("Datos cargados:", datos);

      // Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase.txt";

      // Copiar datos al portapapeles
      await Clipboard.setStringAsync(jsonString);
      console.log("Datos (JSON) copiados al portapapeles.");

      // Verificar si la función de compartir está disponible
      if (!(await Sharing.isAvailableAsync())) {
        alert("La función Compartir/Guardar no está disponible en tu dispositivo");
        return;
      }

      // Guardar el archivo temporalmente
      const fileUri = FileSystem.cacheDirectory + baseFileName;

      // Escribir el contenido JSON en el caché temporal
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Abrir el diálogo de compartir
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartir datos de Firebase (JSON)'
      });

      alert("Datos copiados al portapapeles y listos para compartir.");
    } catch (error) {
      console.error("Error al exportar y compartir:", error);
      alert("Error al exportar o compartir: " + error.message);
    }
  };


  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      Nombre: producto.nombre,
      Precio: producto.precio.toString(),
      Descripcion: producto.descripcion,
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };


  //Lógica del excel
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  //Segunda parte
  const generarExcel = async () => {
    try {
      const datosParaExcel = [
        { Nombre: "Helado", Descripcion: "Helado de caramelo", Precio: 36},
        { Nombre: "Helado", Descripcion: "Helado de caramelo", Precio: 35},
        { Nombre: "Helado", Descripcion: "Helado de chocolate", Precio: 36}
      ];

      const response = await fetch('https://h436cliirg.execute-api.us-east-2.amazonaws.com/generarexcel', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: datosParaExcel })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Obtencion de ArrayBuffer y conversion a base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);

      // Ruta para guardar el archivo temporal
      const fileUri = FileSystem.documentDirectory + "reporte.xlsx";

      // Escribir el archivo en el sistema de archivos
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Compartir el archivo generado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Descargar Reporte Excel'
        });
      } else {
        alert("Compartir no disponible. Revisa la consola para logs.");
      }
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />

      <View style={styles.botones}>
        <BotonPequeño titulo="Cerrar Sesión" onPress={cerrarSesion} />
        <BotonPequeño titulo="Exportar" onPress={exportarDatos} />
        <BotonPequeño titulo="Exportar Todo" onPress={exportarDatos} />
        <BotonPequeño titulo="Generar Excel" onPress={generarExcel} />
      </View>
      
      <TablaProductos
        productos={productos}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  botones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

export default Productos;