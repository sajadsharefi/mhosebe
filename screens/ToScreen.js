// ToScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

const ToScreen = ({ route }) => {
  const navigation = useNavigation();
  const { onItemSelected } = route.params;
  const [showAccountContent, setShowAccountContent] = useState(false);
  const [showExpenseContent, setShowExpenseContent] = useState(false);
  const [showIncomeContent, setShowIncomeContent] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const fetchAccounts = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM banks', // تغییر نام جدول به banks
        [],
        (tx, results) => {
          let fetchedAccounts = [];
          for (let i = 0; i < results.rows.length; i++) {
            fetchedAccounts.push(results.rows.item(i));
          }
          setAccounts(fetchedAccounts);
        },
        error => {
          console.error("Error fetching accounts:", error);
          Alert.alert("Error", "Failed to fetch accounts.");
        }
      );
    });
  };

  const fetchExpenses = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses',
        [],
        (_, results) => {
          let fetchedExpenses = [];
          for (let i = 0; i < results.rows.length; i++) {
            fetchedExpenses.push(results.rows.item(i));
          }
          setExpenses(fetchedExpenses);
        },
        error => {
          console.error("Error fetching expenses:", error);
        }
      );
    });
  };

  const fetchIncomes = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM incomes',
        [],
        (_, results) => {
          let fetchedIncomes = [];
          for (let i = 0; i < results.rows.length; i++) {
            fetchedIncomes.push(results.rows.item(i));
          }
          setIncomes(fetchedIncomes);
        },
        error => {
          console.error("Error fetching incomes:", error);
        }
      );
    });
  };

  useEffect(() => {
    fetchAccounts();
    fetchExpenses();
    fetchIncomes();
  }, []);

  const handleToItemSelect = (item, type) => {
    let selectedValue = { name: '', id: null, tableName: '' };
    switch (type) {
      case 'account':
        selectedValue = { name: item.name, id: item.id, tableName: 'banks' }; // Assuming accounts are in 'banks' table
        break;
      case 'expense':
        selectedValue = { name: item.description, id: item.id, tableName: 'expenses' };
        break;
      case 'income':
        selectedValue = { name: item.source, id: item.id, tableName: 'incomes' };
        break;
      default:
        console.warn('Unknown item type');
        return;
    }
    onItemSelected(selectedValue);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={() => setShowAccountContent(!showAccountContent)}>
        <View style={styles.toggleButton}>
          <Icon name="chevron-down-outline" size={24} color="black" />
          <Text style={styles.toggleButtonText}>حساب ها</Text>
        </View>
        {showAccountContent && (
          <FlatList
            data={accounts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleToItemSelect(item, 'account')}>
                <View style={styles.option}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => setShowExpenseContent(!showExpenseContent)}>
        <View style={styles.toggleButton}>
          <Icon name="chevron-down-outline" size={24} color="black" />
          <Text style={styles.toggleButtonText}>هزینه‌ها</Text>
        </View>
        {showExpenseContent && (
          <FlatList
            data={expenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleToItemSelect(item, 'expense')}>
                <View style={styles.option}>
                  <Text style={styles.optionText}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => setShowIncomeContent(!showIncomeContent)}>
        <View style={styles.toggleButton}>
          <Icon name="chevron-down-outline" size={24} color="black" />
          <Text style={styles.toggleButtonText}>درآمدها</Text>
        </View>
        {showIncomeContent && (
          <FlatList
            data={incomes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleToItemSelect(item, 'income')}>
                <View style={styles.option}>
                  <Text style={styles.optionText}>{item.source}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  box: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    width: '100%',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#000',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 14,
  },
});

export default ToScreen;