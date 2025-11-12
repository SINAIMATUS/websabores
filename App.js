import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./src/database/firebaseconfig";
import Login from "./src/components/InicioDeSesion";
import Productos from "./src/views/Productos";
import ProductosRealtime from "./src/views/ProductosRealtime";
import FormularioIMC from "./src/components/FormularioIMC";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();


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

    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;

  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Productos">
          {() => <Productos cerrarSesion={cerrarSesion} />}
        </Tab.Screen>
        <Tab.Screen name="Realtime DB" component={ProductosRealtime} />
        <Tab.Screen name="Calculadora IMC" component={FormularioIMC} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 
