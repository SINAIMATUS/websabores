import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View } from "react-native";
import { auth } from "./src/database/firebaseconfig";
import Login from "./src/views/Productos";
import Productos from "./src/views/Productos";

export default function App() {
  const [Usuario, setUsuario] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);

    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);

  };

  if (!Usuario) {

    return <Login onLoginSucess={() => setUsuario(auth.currentUser)} />;

  }

  return (
    <View style={{ flex: 1 }}>
      <Productos cerrarSesion={cerrarSesion} />
    </View>

  );
} 
