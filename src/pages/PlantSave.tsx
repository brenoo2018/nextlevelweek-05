import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';

import { Button } from '../components/Button';

import { loadPlant, PlantProps, savePlant } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import waterdrop from '../assets/waterdrop.png';

interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const { plant } = route.params as Params;

  function handleChangeTime(event: Event, datetime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker((oldState) => !oldState);
    }

    if (datetime && isBefore(datetime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert('Escolha uma hora no futuro! ⏰');
    }

    if (datetime) {
      setSelectedDateTime(datetime);
    }
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });

      navigation.navigate('Confirmation', {
        title: 'Tudo certo',
        subtitle:
          'Fique tranquilo que sempre vamos lemborar você de cuidar da sua plantinha com muito cuidado',
        buttonTitle: 'Muito obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants',
      });
    } catch (error) {
      console.log('erro handleSave', error);
      Alert.alert('Não foi possível salvar');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.plantInfo}>
        <SvgFromUri uri={plant.photo} height={150} width={150} />

        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantAbout}>{plant.about}</Text>
      </View>

      <View style={styles.controller}>
        <View style={styles.tipContainer}>
          <Image style={styles.tipImage} source={waterdrop} />
          <Text style={styles.tipText}>{plant.water_tips}</Text>
        </View>

        <Text style={styles.alertLabel}>
          Escolha o melhor horário para ser lembrado
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateTime}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}

        {Platform.OS === 'android' && (
          <TouchableOpacity
            style={styles.dateTimePickerButton}
            onPress={handleOpenDateTimePickerForAndroid}
          >
            <Text style={styles.dateTimePickerText}>
              {`Mudar Horário ${format(selectedDateTime, 'HH:mm')}`}
            </Text>
          </TouchableOpacity>
        )}

        <Button title="Cadastrar planta" onPress={() => handleSave()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  plantName: {
    textAlign: 'center',
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    fontSize: 12,
    color: colors.heading,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
