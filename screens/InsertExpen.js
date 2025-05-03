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

const InsertExpen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const addExpen = () => {
    if (description && amount) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO expenses (description, amount) VALUES (?, ?)',
          [description, amount],
          () => {
            console.log('Expense added successfully');
            navigation.navigate('Expen'); // بازگشت به صفحه هزینه‌ها
          },
          (tx, error) => {
            console.error('Error adding expense: ', error);
          }
        );
      });
      setDescription(''); // تنظیم دوباره توضیحات به رشته خالی
      setAmount(''); // تنظیم دوباره مقدار هزینه به رشته خالی
    } else {
      console.log('Description and Amount cannot be empty');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>اضافه کردن هزینه</Text>
      <TextInput
        style={styles.input}
        placeholder="توضیحات"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="مقدار"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="ثبت" onPress={addExpen} />
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

export default InsertExpen;