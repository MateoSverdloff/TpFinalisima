import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import moment from 'moment';
import { getEventsByCategory } from '../services/EventServiceSearch.js';

const EventCategoryDetail = ({ route, navigation }) => {
    const { categoryId } = route.params; 
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventsByCategory(categoryId);
                
                if (data && Array.isArray(data) && data[0]?.response) {
                    const eventData = data[0].response;
                    const eventsArray = eventData ? [eventData] : [];
                    setEvents(eventsArray);
                } else {
                    setEvents([]);
                    Alert.alert('Error', 'No se pudieron cargar los eventos');
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar los eventos de esta categoría');
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, [categoryId]);

    const handleEventPress = (eventId) => {
        if (eventId) {
            navigation.navigate('EventDetail', { eventId });
        }
    };

    const renderEventCard = ({ item }) => {
        if (!item) return null;
        
        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => handleEventPress(item.event_id)}
            >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text>Fecha: {moment(item.start_date).format('DD/MM/YYYY')}</Text>
                <Text>Duración: {item.duration_in_minutes} minutos</Text>
                <Text>Precio: ${item.price}</Text>
                <Text>Ubicación: {item.event_location?.name}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Cargando eventos...</Text>
            </View>
        );
    }

    if (!events || events.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noEventsText}>No hay eventos disponibles en esta categoría</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.event_id?.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 16,
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        marginBottom: 8,
        color: '#666',
    },
    noEventsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    }
});

export default EventCategoryDetail;
