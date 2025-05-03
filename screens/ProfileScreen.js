import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

const InsertBank = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers(); // بارگذاری کاربران هنگام بارگذاری کامپوننت
  }, []);

  const loadUsers = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM banks',
        [],
        (_, results) => {
          const usersArray = [];
          for (let i = 0; i < results.rows.length; i++) {
            usersArray.push(results.rows.item(i));
          }
          setUsers(usersArray);
        },
        error => { console.error('Error loading users: ', error); }
      );
    });
  };

  return (
    <View style={styles.container}>
      {users.map((bank, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.textrow}>{bank.name}</Text>

          <Text style={styles.textrow}>{bank.amount}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('InsertBank')}>
          <Ionicons style={styles.icons} name="add-outline" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.textrow}>اضافه کردن</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  icons: {
    backgroundColor: '#9af59a',
    padding: 5,
    borderRadius: 20,
    fontSize: 25,
  },
  textrow: {
    fontSize: 17,
  },
});

export default InsertBank;