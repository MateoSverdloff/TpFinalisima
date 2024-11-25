import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList } from 'react-native';
import moment from 'moment';
import { getEventById, getParticipants, subscribeToEvent, unsubscribeFromEvent } from '../services/EventServices';
import { getEventsByCategory } from '../services/EventServiceSearch.js';

const EventCategoryDetail = ({ route, navigation }) => {
    const { categoryId } = route.params; 
    const [event, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventsByCategory(categoryId);
                
                if (data && data.success === false && data.message) {
                    Alert.alert('Error', data.message, [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]);
                    return;
                }

                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                Alert.alert('Error', 'Failed to load events for this category');
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, [categoryId, navigation]);

    const handleParticipants = async () => {
        try {
            const participantsData = await getParticipants(eventId);    
            if (participantsData.success) {
                const participantList = participantsData.response[0].response; 
    
                setParticipants(participantList);
                const isUserSubscribed = participantList.some(participant => participant.username === user.username);
                setIsSubscribed(isUserSubscribed);
            } else {
                Alert.alert('Error', 'Failed to load participants');
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
            Alert.alert('Error', 'Failed to load participants');
        }
    };
    
    const handleSubscribe = async () => {
        try {
            await subscribeToEvent(eventId, token);
            setIsSubscribed(true);
            Alert.alert('Success', 'You have successfully subscribed to the event.');
        } catch (error) {
            Alert.alert('Error', 'Failed to subscribe to the event.');
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await unsubscribeFromEvent(eventId, token);
            setIsSubscribed(false);
            Alert.alert('Success', 'You have successfully unsubscribed from the event.');
        } catch (error) {
            Alert.alert('Error', 'Failed to unsubscribe from the event.');
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!event || event.length === 0 || !event[0].response) {
        return <Text>Event not found</Text>;
    }

    const isEventPast = moment(event[0].response.start_date).isBefore(moment());

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event[0].response.name || 'Evento no disponible'}</Text>
            <Text style={styles.description}>{event[0].response.description || 'Descripción no disponible'}</Text>
            <Text>Fecha: {moment(event[0].response.start_date).format('DD/MM/YYYY')}</Text>
            <Text>Duración: {event[0].response.duration_in_minutes} minutos</Text>
            <Text>Precio: ${event[0].response.price}</Text>
            <Text>Máximo de Asistentes: {event[0].response.max_assistance}</Text>
            <Text>
                Creador: {event[0].response.creator_user?.first_name} {event[0].response.creator_user?.last_name || 'No disponible'}
            </Text>
            <Text>Ubicación: {event[0].response.event_location?.name || 'No disponible'}</Text>
            <Text>Dirección: {event[0].response.event_location?.full_address || 'No disponible'}</Text>
            
            {!isEventPast && (
                <View style={styles.buttonContainer}>
                    {isSubscribed ? (
                        <Button title="Desuscribirse" onPress={handleUnsubscribe} />
                    ) : (
                        <Button title="Inscribirse" onPress={handleSubscribe} />
                    )}
                </View>
            )}

            <View>
                <Text style={styles.participantHeader}>Participantes:</Text>
                <FlatList
                    data={participants}
                    keyExtractor={(item) => item.username}
                    renderItem={({ item }) => (
                        <View style={styles.participantItem}>
                            <Text>
                                {item.first_name} {item.last_name} - Asistió: {moment(event[0].response.start_date).isBefore(moment()) ? (item.attended ? 'Sí' : 'No') : 'N/A'}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        marginVertical: 10,
        fontSize: 16,
    },
    participantHeader: {
        fontSize: 20,
        marginTop: 20,
        fontWeight: 'bold',
    },
    participantItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        marginVertical: 20,
    },
});

export default EventCategoryDetail;
