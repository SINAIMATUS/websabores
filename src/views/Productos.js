import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, QuerySnapshot, orderBy, limit, query, where } from "firebase/firestore";
import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import BotonPequeno from "../components/BotonPequeño";

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
          descipcion: nuevoProducto.Descripcion,
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
      nombre: producto.Nombre,
      precio: producto.Precio.toString(),
      descipcion: producto.Descripcion,
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
      const datosParaExcel = productos.map(p => ({
        nombre: p.Nombre,
        descripcion: p.Descripcion,
        precio: p.Precio,
      }));

      const response = await fetch('https://3hed3uthud.execute-api.us-east-2.amazonaws.com/generarexcel', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: datosParaExcel }),
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

  // Prueba ya sin datos estáticos
  const cargarCiudadesFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Ciudades"));
      const Ciudades = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return Ciudades;
    } catch (error) {
      console.error("Error extrayendo ciudades:", error);
      return [];
    }
  };

  //Segundo generador de excel 
  const generarExcelDos = async () => {
    try {
      // Obtener solo datos de "ciudades"
      const Ciudades = await cargarCiudadesFirebase();
      if (Ciudades.length === 0) {
        throw new Error("No hay datos en la colección 'ciudades'.");
      }

      console.log("Ciudades para Excel:", Ciudades);
      const response = await fetch(' https://3hed3uthud.execute-api.us-east-2.amazonaws.com/generarexcel', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: Ciudades })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Obtencion de ArrayBuffer y conversion a base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);

      // Ruta para guardar el archivo temporalmente
      const fileUri = FileSystem.documentDirectory + "reporte_ciudades.xlsx";

      // Escribir el archivo Excel
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Compartir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Descargar Reporte de Ciudades'
        });
      } else {
        alert("Compartir no disponible.");
      }

      alert("Excel de ciudades generado y listo para descargar!");
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
    }
  };

  const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );

      const snapshot = await getDocs(q);
      console.log("---------Consulta1--------------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}`);
      });
    } catch (error) {
      console.log("Error en la consulta:", error);
    }
  };

  const pruebaConsulta2 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta2: 2 ciudades salvadoreñas, orden población asc--------------");
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta2:", error);
    }
  };

  const pruebaConsulta3 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("poblacion", "<=", 300000),
        orderBy("poblacion", "asc"),  // Agregado: primer orderBy en el campo del rango
        orderBy("pais", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta3: Ciudades centroamericanas <=300k, orden país desc, limit 4--------------");
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta3:", error);
    }
  };

  const pruebaConsulta4 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("poblacion", ">", 900000),
        orderBy("poblacion", "asc"),  // Agregado: primer orderBy en el campo del rango
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta4: 3 ciudades >900k, orden nombre asc--------------");  // Corregí "4 ciudades" a "3 ciudades" para coincidir con el limit
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta4:", error);
    }
  };

  const pruebaConsulta5 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta5: Ciudades guatemaltecas, orden población desc, limit 5--------------");
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta5:", error);
    }
  };

  const pruebaConsulta6 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("poblacion", ">=", 200000),
        where("poblacion", "<=", 600000),
        orderBy("poblacion", "asc"),  // Agregado para consistencia y evitar posibles errores futuros
        orderBy("pais", "asc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta6: Ciudades entre 200k y 600k, orden país asc, limit 5--------------");
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta6:", error);
    }
  };

  const pruebaConsulta7 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        orderBy("poblacion", "desc"),
        orderBy("pais", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("---------Consulta7: 5 ciudades con mayor población, orden población desc y país desc--------------");
      if (snapshot.empty) {
        console.log("No hay resultados.");
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, etc.`);
        });
      }
    } catch (error) {
      console.log("Error en la consulta7:", error);
    }
  };


  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
    pruebaConsulta2();
    pruebaConsulta3();
    pruebaConsulta4();
    pruebaConsulta5();
    pruebaConsulta6();
    pruebaConsulta7();

  }, []);

  return (
    <View style={styles.container}>

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />



      <TablaProductos
        productos={productos}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />
      <View style={styles.botones}>
        <BotonPequeno titulo="Exportar" onPress={exportarDatos} />
        <BotonPequeno titulo="Exportar Todo" onPress={exportarDatos} />
        <BotonPequeno titulo="Generar Excel" onPress={generarExcel} />
        <BotonPequeno titulo="Generar Excel2" onPress={generarExcelDos} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;