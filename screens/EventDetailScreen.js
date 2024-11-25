import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, ActivityIndicator } from 'react-native';
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
                if (data.success && data.response && Array.isArray(data.response)) {
                    const eventData = data.response[0]?.response;
                    if (eventData) {
                        setEvent(eventData);
                        await handleParticipants();
                    } else {
                        Alert.alert('Error', 'No se pudo cargar el evento');
                    }
                } else {
                    Alert.alert('Error', 'No se pudo cargar el evento');
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el evento');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleParticipants = async () => {
        try {
            const participantsData = await getParticipants(eventId);    
            if (participantsData.success && participantsData.response) {
                let participantList = [];
                
                if (Array.isArray(participantsData.response)) {
                    participantList = participantsData.response;
                } else if (participantsData.response[0]?.response) {
                    participantList = participantsData.response[0].response;
                }

                setParticipants(participantList);
                
                if (Array.isArray(participantList)) {
                    setIsSubscribed(participantList.some(participant => 
                        participant.username === user?.username
                    ));
                }
            }
        } catch (error) {
            console.error('Error al cargar participantes:', error);
        }
    };
    
    const handleSubscribe = async () => {
        try {
            await subscribeToEvent(eventId, token);
            setIsSubscribed(true);
            await handleParticipants();
            Alert.alert('Éxito', 'Te has inscrito al evento exitosamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo realizar la inscripción');
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await unsubscribeFromEvent(eventId, token);
            setIsSubscribed(false);
            await handleParticipants();
            Alert.alert('Éxito', 'Te has desinscrito del evento exitosamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo realizar la desinscripción');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando detalles del evento...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text>No se encontró el evento</Text>
            </View>
        );
    }

    const isEventPast = moment(event.start_date).isBefore(moment());

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text>Fecha: {moment(event.start_date).format('DD/MM/YYYY')}</Text>
            <Text>Duración: {event.duration_in_minutes} minutos</Text>
            <Text>Precio: ${event.price}</Text>
            <Text>Máximo de Asistentes: {event.max_assistance}</Text>
            {event.creator_user && (
                <Text>Creador: {event.creator_user.first_name} {event.creator_user.last_name}</Text>
            )}
            {event.event_location && (
                <>
                    <Text>Ubicación: {event.event_location.name}</Text>
                    <Text>Dirección: {event.event_location.full_address}</Text>
                </>
            )}
            
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
                    keyExtractor={(item) => item.username || Math.random().toString()}
                    renderItem={({ item }) => (
                        <View style={styles.participantItem}>
                            <Text>
                                {item.first_name} {item.last_name}
                                {isEventPast && ` - Asistió: ${item.attended ? 'Sí' : 'No'}`}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.noParticipants}>No hay participantes registrados</Text>
                    }
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        marginVertical: 10,
        fontSize: 16,
    },
    participantHeader: {
        fontSize: 20,
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    participantItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        marginVertical: 20,
    },
    noParticipants: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
    }
});

export default EventDetailScreen;
