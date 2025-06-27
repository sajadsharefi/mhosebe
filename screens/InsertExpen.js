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

const InsertExpen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const formatAmount = (value) => {
    // حذف کاراکترهای غیر عددی
    const cleanedValue = value.replace(/[^0-9]/g, '');
    // فرمت کردن به رشته با کاما
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (value) => {
    setAmount(formatAmount(value));
  };

  const addExpen = () => {
    if (description && amount) {
      // تبدیل مقدار به عدد صحیح (ریال) بدون کاما
      const formattedAmount = parseFloat(amount.replace(/,/g, ''));
      
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO expenses (description, amount) VALUES (?, ?)',
          [description, formattedAmount],
          () => {
            Alert.alert('موفقیت', 'هزینه با موفقیت اضافه شد!');
            navigation.replace('Expen');
          },
          (tx, error) => {
            Alert.alert('خطا', 'خطا در اضافه کردن هزینه: ' + error.message);
          }
        );
      });
      setDescription(''); // تنظیم دوباره توضیحات به رشته خالی
      setAmount(''); // تنظیم دوباره مقدار هزینه به رشته خالی
    } else {
      Alert.alert('خطا', 'توضیحات و مقدار نمی‌توانند خالی باشند');
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
        onChangeText={handleAmountChange}
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