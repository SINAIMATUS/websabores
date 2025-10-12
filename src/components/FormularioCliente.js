import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const FormularioClientes = ({ cargarDatos }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [edad, setEdad] = useState('');


    const guardarCliente = async () => {
        try {
            await addDoc(collection(db, "Clientes"), {
                nombre: nombre,
                apellido: apellido,
                cedula: cedula,
                telefono: telefono,
                edad: edad
            });
            setNombre('');
            setApellido('');
            setCedula('');
            setTelefono('');
            setEdad('');
            alert('Cliente agregado con éxito');
            cargarDatos();
        } catch (error) {
            console.error("Error al registrar el Cliente:", error);
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
            <Button title="Guardar" onPress={guardarCliente} />
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

export default FormularioClientes;