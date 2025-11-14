import React, { useEffect, useState } from 'react';
import { View, StyleSheet,Button, Alert } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import FormularioCliente from '../components/FormularioCliente.js';
import ListaClientes from '../components/ListaClientes.js';
import TablaClientes from '../components/TablaClientes.js';
import { collection, getDocs, doc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";



const Clientes = () => {
    const [clientes, setClientes] = useState([]);

    const cargarDatos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Clientes"));
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

    const eliminarCliente = async (id) => {
        try {
            await deleteDoc(doc(db, "Clientes", id));
            cargarDatos(); // Recargar lista
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };
    const extraerYGuardarMascotas = async () => {
  try {
    // Abrir selector de documentos para elegir archivo Excel
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      Alert.alert("Cancelado", "No se seleccionó ningún archivo.");
      return;
    }

    const { uri, name } = result.assets[0];
    console.log(`Archivo seleccionado: ${name} en ${uri}`);

    // Leer el archivo como base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Enviar a Lambda para procesar
    const response = await fetch("https://tixq2zwrz7.execute-api.us-east-2.amazonaws.com/extraerexcel2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archivoBase64: base64 }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP en Lambda: ${response.status}`);
    }

    const body = await response.json();
    const { datos } = body;

    if (!datos || !Array.isArray(datos) || datos.length === 0) {
      Alert.alert("Error", "No se encontraron datos en el Excel o el archivo está vacío.");
      return;
    }

    console.log("Datos extraídos del Excel:", datos);

    // Guardar cada fila en la colección 'mascotas'
    let guardados = 0;
    let errores = 0;

    for (const mascota of datos) {
      try {
        // Columnas: 'nombre', 'edad', 'raza' (ajusta si los headers son diferentes)
        await addDoc(collection(db, "Mascotas"), {
          nombre: mascota.nombre || "",
          edad: parseInt(mascota.edad) || 0,
          raza: mascota.raza || "",
        });
        guardados++;
      } catch (err) {
        console.error("Error guardando mascota:", mascota, err);
        errores++;
      }
    }

    Alert.alert(
      "Éxito",
      `Se guardaron ${guardados} mascotas en la colección. Errores: ${errores}.`,
      [{ text: "OK" }]
    );

  } catch (error) {
    console.error("Error en extraerYGuardarMascotas:", error);
    Alert.alert("Error", `Error procesando el Excel: ${error.message}`);
  }
};


    return (
        <View style={styles.container}>
            <FormularioCliente cargarDatos={cargarDatos} />
            <ListaClientes clientes={clientes} />
            <TablaClientes
                clientes={clientes}
                eliminarCliente={eliminarCliente}
            />
            <View style={{marginVertical: 10}}>
            <Button title="Extraer mascotas desde Excel" onPress={extraerYGuardarMascotas}/>
            </View>
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