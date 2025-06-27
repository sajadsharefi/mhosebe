import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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

  const formatAmount = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (value) => {
    setAmount(formatAmount(value));
  };

  const addIncome = () => {
    if (source && amount) {
      const formattedAmount = parseFloat(amount.replace(/,/g, ''));
      
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO incomes (source, amount) VALUES (?, ?)',
          [source, formattedAmount],
          () => {
            Alert.alert('موفقیت', 'درآمد با موفقیت اضافه شد!');
            navigation.replace('Income');
          },
          (tx, error) => {
            console.error('Error adding income: ', error);
          }
        );
      });
      setSource('');
      setAmount('');
    } else {
      Alert.alert('خطا', 'منبع و مقدار نمی‌توانند خالی باشند');
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
        onChangeText={handleAmountChange}
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