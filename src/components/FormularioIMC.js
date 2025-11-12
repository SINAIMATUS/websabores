import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import BotonPequeño from './BotonPequeño';

const FormularioIMC = () => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [imc, setImc] = useState(null);

    const calcularYGuardarIMC = async () => {
        const pesoLibras = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (isNaN(pesoLibras) || isNaN(alturaNum) || pesoLibras <= 0 || alturaNum <= 0) {
            Alert.alert("Error", "Por favor, introduce un peso y una altura válidos.");
            return;
        }

        // Convertir libras a kilogramos para la fórmula del IMC
        const pesoKilos = pesoLibras * 0.453592;

        // La altura se introduce en centímetros y se convierte a metros para el cálculo
        const alturaMetros = alturaNum / 100;
        const imcCalculado = pesoKilos / (alturaMetros * alturaMetros);
        const imcRedondeado = imcCalculado.toFixed(2);
        setImc(imcRedondeado);

        try {
            await addDoc(collection(db, "RegistrosIMC"), {
                peso: pesoLibras, // Guardamos el peso original en libras
                altura: alturaNum, // Guardamos la altura en cm
                imc: parseFloat(imcRedondeado),
                fecha: serverTimestamp()
            });
            Alert.alert("Registro Guardado", `Tu IMC es ${imcRedondeado}. Los datos han sido guardados.`);
            // No limpiamos los campos para que el usuario vea los datos que introdujo
        } catch (error) {
            console.error("Error al guardar el registro de IMC:", error);
            Alert.alert("Error", "No se pudo guardar el registro.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Calculadora de IMC</Text>
            <TextInput
                style={styles.input}
                placeholder="Peso (en libras)"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Altura (en cm)"
                value={altura}
                onChangeText={setAltura}
                keyboardType="numeric"
            />
            <BotonPequeño titulo="Calcular y Guardar IMC" onPress={calcularYGuardarIMC} />
            {imc && (
                <Text style={styles.resultado}>Tu IMC es: {imc}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    resultado: { marginTop: 20, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default FormularioIMC;