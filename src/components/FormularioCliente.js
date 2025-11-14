import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Alert } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import BotonPequeño from './BotonPequeño';
 
const FormularioClientes = ({ cargarDatos }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [edad, setEdad] = useState('');


    const guardarCliente = async () => {
        if (!nombre || !apellido || !cedula) {
            Alert.alert("Campos incompletos", "Por favor, completa Nombre, Apellido y Cédula.");
            return;
        }

        try {
            await addDoc(collection(db, "Clientes"), {
                Nombre: nombre,
                Apellido: apellido,
                Cedula: cedula,
                Telefono: telefono.replace(/[^0-9]/g, ''), // Guarda solo números
                Edad: edad ? parseInt(edad.replace(/[^0-9]/g, '')) : 0 // Guarda como número o 0 si está vacío
            });
            setNombre('');
            setApellido('');
            setCedula('');
            setTelefono('');
            setEdad('');
            Alert.alert('Éxito', 'Cliente agregado correctamente');
            cargarDatos();
        } catch (error) {
            console.error("Error al registrar el Cliente:", error);
            Alert.alert('Error', 'No se pudo registrar el cliente.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre del Cliente"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
            />
            <TextInput
                style={styles.input}
                placeholder="Cédula"
                value={cedula}
                onChangeText={setCedula}
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Edad"
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric"
            />
            <BotonPequeño titulo="Guardar" onPress={guardarCliente} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#0208b6ff',
        padding: 7,
        marginBottom: 8,
        borderRadius: 5,
    },
});

export default FormularioClientes;