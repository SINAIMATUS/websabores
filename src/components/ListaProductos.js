import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListaProductos = ({ productos }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de los Productos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <text style={styles.item}>
                        {item.nombre} - ${item.precio}
                        </text>
                )}
                />
        </View>
    );
          };

          const styles = StyleSheet.create({
            container: {flex: 1, justifyContent: "center"},
            titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10},
            item: { fontSize: 18, marginBottom: 5 },
          });

          export default ListaProductos;
