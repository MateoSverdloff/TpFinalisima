import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getCategories } from '../services/EventServiceSearch';

const EventSearch = ({ navigation }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryPress = (categoryId) => {
        navigation.navigate('EventCategoryDetail', { categoryId });
    };

    const renderCategoryCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleCategoryPress(item.id)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EventSearch;
