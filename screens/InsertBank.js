import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

const InsertBank = () => {
  const [bankName, setBankName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');

  const addBank = () => {
    if (bankName && accountNumber) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO banks (name, amount) VALUES (?, ?)',
          [bankName, accountNumber],
          () => {
            console.log('User added successfully');
            loadUsers(); // بارگذاری کاربران جدید
          },
          (tx, error) => {
            console.error('Error adding user: ', error);
          }
        );
      });
      setBankName(''); // تنظیم دوباره نام به رشته خالی
      setAccountNumber(''); // تنظیم دوباره مقدار شماره حساب به رشته خالی
    } else {
      console.log('Bank Name and Account Number cannot be empty');
    }
  };

  const handleSubmit = () => {
    addBank(); // فراخوانی تابع افزودن کاربر
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insert Bank Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
      />
      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
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

export default InsertBank;