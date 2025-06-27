import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
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

    const backAction = () => {
      navigation.navigate('Home'); // صفحه‌ای که می‌خواهید به آن بروید
      return true; // جلوگیری از رفتار پیش‌فرض دکمه برگشت
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // حذف لیسنر در هنگام Unmount
  }, []);

  const loadIncome = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM incomes',
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

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      {income.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.textrow}>{item.source}</Text>
          <Text style={styles.textrow}>{formatAmount(item.amount)}</Text>
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