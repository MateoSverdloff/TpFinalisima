// EventScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getEvents } from '../services/EventServices';

const EventScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (eventId) => {
    navigation.navigate('EventDetail', { eventId });
  };  

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleEventPress(item.id)}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Fecha: {item.start_date}</Text>
      <Text>Precio: ${item.price}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id.toString()}
        extraData={events}
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

export default EventScreen;
