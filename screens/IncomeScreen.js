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

const IncomeScreen = ({ navigation }) => {
  const [income, setIncome] = useState([]);

  useEffect(() => {
    loadIncome(); // بارگذاری درآمدها هنگام بارگذاری کامپوننت
  }, []);

  const loadIncome = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM income',
        [],
        (_, results) => {
          const incomeArray = [];
          for (let i = 0; i < results.rows.length; i++) {
            incomeArray.push(results.rows.item(i));
          }
          setIncome(incomeArray);
        },
        error => { console.error('Error loading income: ', error); }
      );
    });
  };

  return (
    <View style={styles.container}>
      {income.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.textrow}>{item.source}</Text>
          <Text style={styles.textrow}>{item.amount}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('InsertIncome')}>
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

export default IncomeScreen;