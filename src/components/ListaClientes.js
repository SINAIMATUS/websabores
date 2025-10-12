import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListaClientes = ({ clientes }) => {
    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.Nombre}</Text>
            <Text style={styles.celda}>{item.Apellido}</Text>
            <Text style={styles.celda}>{item.Cedula}</Text>
            <Text style={styles.celda}>{item.Telefono}</Text>
            <Text style={styles.celda}>{item.Edad}</Text>
        </View>
    );



    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Clientes</Text>
            <View style={styles.fila}>
            </View>

            <FlatList
                data={clientes}
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
        padding: 8,
    },
    titulo: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 10,
    },
    item: {
        paddingVertical: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#0b27c7ff',
    },
    nombre: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    apellido: {
        fontSize: 10,
        color: '#000000ff',
        marginVertical: 2,
    },
    cedula: {
        fontSize: 10,
        color: '#291212ff',
    },
    telefono: {
        fontSize: 10,
        color: '#291212ff',
    },
    edad: {
        fontSize: 10,
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

export default ListaClientes;