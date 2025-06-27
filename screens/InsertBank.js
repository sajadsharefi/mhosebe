import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

const InsertBank = ({ navigation }) => {
  const [bankName, setBankName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');

  const formatAmount = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAccountChange = (value) => {
    setAccountNumber(formatAmount(value));
  };

  const addBank = () => {
    if (bankName && accountNumber) {
      const formattedAccountNumber = accountNumber.replace(/,/g, '');

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO banks (name, amount) VALUES (?, ?)',
          [bankName, formattedAccountNumber],
          () => {
            Alert.alert('موفقیت', 'حساب بانکی با موفقیت اضافه شد!');
            navigation.replace('Profile');
          },
          (tx, error) => {
            console.error('Error adding user: ', error);
          }
        );
      });
      setBankName('');
      setAccountNumber('');
    } else {
      Alert.alert('خطا', 'نام بانک و شماره حساب نمی‌توانند خالی باشند');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اضافه کردن حساب بانکی</Text>
      <TextInput
        style={styles.input}
        placeholder="نام بانک"
        value={bankName}
        onChangeText={setBankName}
      />
      <TextInput
        style={styles.input}
        placeholder="مقدار اولیه حساب"
        value={accountNumber}
        onChangeText={handleAccountChange}
        keyboardType="numeric"
      />
      <Button title="ثبت" onPress={addBank} />
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