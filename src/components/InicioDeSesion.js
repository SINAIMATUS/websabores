import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleeSheet, Alert} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../database/firebaseconfig";
import { onBackgroundMessage } from 'firebase/messaging/sw';

const Login = ({onLong}) => {}
const [email, setEmail] = useState("");
const [password, setPassword ] = useState ("");

const manejarLogin = async () =>{
    if (!email || !password){
        Alert.alert("Error", "Por favor completa ambos campos.");
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();   
    }catch (error){
        console.Log(error);
        let mensaje = 'Error al iniciar sesion.';

        if (error.code === 'auth/invalid-email'){
            mensaje = "Correo invalido.";
        }
        if (error.code === 'auth/user-not-found') {
            mensaje = "Usuario no encontrado.";
        
        }if (error.code === 'auth/wrong-password') {
            mensaje = "Contraseña.";
        }
        Alert.alert("Error",mensaje);
        
    }

};

return (
    <View style={styles.container}>
    <Text style={styles.titulo}>Iniciar Sesion</Text>
    <TextInput
    style={styles.input}
    placeholder='Correo electronico'
    value={email}
    onChangeText={setEmail}
    keyboardType='email-adress'
    autoCapitalize="none"
    />
    <TextInput
    style={styles.input}
    placeholder='Contraseña'
    value={password}
    onChangerText={setPassword}
    secureTextEntry
    />
    <TouchableOpacity style={styles.boton} onPress={manejarLogin}>
        <Text style={styles.textoBoton}>Entrar</Text>
    </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        onBackgroundColor: "f9f9f9",
    },
    titulo: {
        fontSize: 24,
        fontWeight: "center",
        marginBottom: 20,

    },
    input:{
        boderWidth: 1,
        boderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "white",

    },
    boton:{
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",

    },
    textoBoton: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Login;