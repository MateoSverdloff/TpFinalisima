// EventScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { getEvents } from '../services/EventServices';
import moment from 'moment';

const EventScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) {
          const uniqueEvents = Array.from(new Map(data.map(item => [item.id, item])).values());
          setEvents(uniqueEvents);
        } else if (data && Array.isArray(data.response)) {
          const uniqueEvents = Array.from(new Map(data.response.map(item => [item.id, item])).values());
          setEvents(uniqueEvents);
        } else {
          setEvents([]);
          Alert.alert('Error', 'No se pudieron cargar los eventos');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los eventos');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
        onPress={() => handleEventPress(item.id)}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text>Fecha: {moment(item.start_date).format('DD/MM/YYYY')}</Text>
            <Text>Duración: {item.duration_in_minutes} minutos</Text>
            <Text>Precio: ${item.price}</Text>
            <Text>Ubicación: {item.event_location?.name}</Text>
          </View>
          <Image 
            source={require(`../assets/events/8.jpg`)}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>No hay eventos disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id?.toString()}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    color: '#666',
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
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default EventScreen;
