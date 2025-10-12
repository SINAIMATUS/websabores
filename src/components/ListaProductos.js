import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListaProductos = ({ productos }) => {
    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.Nombre}</Text>
            <Text style={styles.celda}>{item.Descripcion}</Text>
            <Text style={styles.celda}>${item.Precio}</Text>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Productos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 10,
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c70b92ff',
    },
    nombre: {
        fontSize: 13,
        color: '#000000ff',
    },
    descripcion: {
        fontSize: 13,
        color: '#000000ff',
        marginVertical: 2,
    },
    precio: {
        fontSize: 13,
        color: '#291212ff',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#2f6ae0ff',
    },
    celda: {
        flex: 1,
        textAlign: 'center',
        fontSize: 8,
    },
});

export default ListaProductos;