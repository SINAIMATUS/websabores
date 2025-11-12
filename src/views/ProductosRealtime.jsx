import react, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { ref, set, push, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig";
import BotonPequeño from "../components/BotonPequeño";

const ProductosRealtime = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [productosRT, setProductosRT] = useState([]);
  
  const guardarEnRT = async () => {
    if (!nombre || !precio || !descripcion) {
      alert("Rellena todos los campos");
      return;
    }
    try {
      const reference = ref(realtimeDB, "Producto_rt");
      const nuevoRef = push(reference);
      await set(nuevoRef, {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
      });

      setNombre("");
      setPrecio("");
      setDescripcion("");
      alert("Producto guardado en Realtime");
    } catch (error) {
      console.log("Error al guardar", error);
    }
  };

  const leerRT = () => {
    const reference = ref(realtimeDB, "Producto_rt");

    onValue(reference, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();

        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos,
        }));
        setProductosRT(lista);
      } else {
        setProductosRT([]);
      }
    });
  };
  useEffect(() => {
    leerRT();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Prueba Realtime Database</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre producto"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={(text) => setPrecio(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={(text) => setDescripcion(text)}
      />

      <BotonPequeño titulo="Guardar en Realtime" onPress={guardarEnRT} />
      
      <Text style={styles.subtitulo}>Productos en RT:</Text>

      {productosRT.length === 0 ? (
        <Text>No hay productos</Text>
      ) : (
        productosRT.map((p) => (
          <Text key={p.id}>
            {p.nombre} - ${p.precio} - {p.descripcion}
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitulo: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
  input: {
    height: 40,
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ProductosRealtime;
