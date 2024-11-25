import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList } from 'react-native';
import moment from 'moment';
import { getEventById, getParticipants, subscribeToEvent, unsubscribeFromEvent } from '../services/EventServices';
import { useAuth } from '../AuthContext';

const EventDetailScreen = ({ route }) => {
    const { eventId } = route.params;
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = user ? user.token : null;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventById(eventId);
                if (data.success) {
                    setEvent(data.response);
                    await handleParticipants();
                } else {
                    Alert.alert('Error', 'Failed to load event details');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleParticipants = async () => {
        try {
            const participantsData = await getParticipants(eventId);    
            if (participantsData.success) {
                const participantList = participantsData.response[0].response; 
    
                setParticipants(participantList);
                const isUserSubscribed = participantList.some(participant => participant.username === user.username);
                setIsSubscribed(isUserSubscribed);
            } else {
                Alert.alert('Ojo!', 'No participo nadie :(');
            }
        } catch (error) {
            Alert.alert('Ojo!', 'No participo nadie :(');
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

    if (!event) {
        return <Text>Event not found</Text>;
    }

    const isEventPast = moment(event.start_date).isBefore(moment());

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text>Fecha: {event.start_date}</Text>
            <Text>Duración: {event.duration_in_minutes} minutos</Text>
            <Text>Precio: ${event.price}</Text>
            <Text>Máximo de Asistentes: {event.max_assistance}</Text>
            <Text>Creador: {event.creator_user.first_name} {event.creator_user.last_name}</Text>
            <Text>Ubicación: {event.event_location.name}</Text>
            <Text>Dirección: {event.event_location.full_address}</Text>
            
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
                                {item.first_name} {item.last_name} - Asistió: {moment(event.start_date).isBefore(moment()) ? (item.attended ? 'Sí' : 'No') : 'N/A'}
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

export default EventDetailScreen;
