import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.error('Error opening database:', error);
  }
);

const TranListScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM transactions',
        [],
        (txObj, resultSet) => {
          const tempTransactions = [];
          for (let i = 0; i < resultSet.rows.length; ++i) {
            const transaction = resultSet.rows.item(i);
            tempTransactions.push(transaction);
          }
          setTransactions(tempTransactions);
        },
        (txObj, error) => console.log('Error fetching transactions:', error)
      );
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem}>
      <Text>تاریخ: {item.date}</Text>
      <Text>مبلغ: {item.amount}</Text>
      <Text>از حساب: {item.from_account}</Text>
      <Text>به حساب: {item.to_account}</Text>
      <Text>توضیحات: {item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>لیست تراکنش‌ها</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default TranListScreen;