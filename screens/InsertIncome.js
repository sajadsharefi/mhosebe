import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

const InsertIncome = ({ navigation }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');

  const addIncome = () => {
    if (source && amount) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO income (source, amount) VALUES (?, ?)',
          [source, amount],
          () => {
            console.log('Income added successfully');
            navigation.navigate('Income'); // بازگشت به صفحه نمایش درآمدها
          },
          (tx, error) => {
            console.error('Error adding income: ', error);
          }
        );
      });
      setSource(''); // تنظیم دوباره منبع به رشته خالی
      setAmount(''); // تنظیم دوباره مقدار به رشته خالی
    } else {
      console.log('Source and Amount cannot be empty');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اضافه کردن درآمد</Text>
      <TextInput
        style={styles.input}
        placeholder="منبع"
        value={source}
        onChangeText={setSource}
      />
      <TextInput
        style={styles.input}
        placeholder="مقدار"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="ثبت" onPress={addIncome} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default InsertIncome;