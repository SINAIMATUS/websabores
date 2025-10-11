import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListaProductos = ({ productos }) => {
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.precio}>${item.precio}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Productos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {item.nombre} - {item.descripcion} - ${item.precio}
                    </Text>
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 10,
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descripcion: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
    },
    precio: {
        fontSize: 16,
        color: '#000',
    },
});

export default ListaProductos;