import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
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
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <Image 
                    source={require(`../assets/events/8.jpg`)}
                    style={styles.categoryImage}
                    resizeMode="cover"
                />
            </View>
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
});

export default EventSearch;
