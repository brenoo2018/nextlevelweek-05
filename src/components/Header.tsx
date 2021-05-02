import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import userImg from '../assets/eu.jpeg';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    async function loadStorageUsername() {
      const user = await AsyncStorage.getItem('@plantmanager:user');
      setUsername(user || '');
    }
    loadStorageUsername();
  }, [username]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá</Text>
        <Text style={styles.userName}>{username}</Text>
      </View>

      <Image style={styles.image} source={userImg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
