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

const FromScreen = ({ route }) => {
  const navigation = useNavigation();
  const { onItemSelected } = route.params; // Changed to a single callback
  const [showBankContent, setShowBankContent] = useState(false);
  const [showExpenseContent, setShowExpenseContent] = useState(false);
  const [showIncomeContent, setShowIncomeContent] = useState(false);
  const [banks, setBanks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const fetchBanks = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM banks',
        [],
        (_, results) => {
          let fetchedBanks = [];
          for (let i = 0; i < results.rows.length; i++) {
            fetchedBanks.push(results.rows.item(i));
          }
          setBanks(fetchedBanks);
        },
        error => {
          console.error("Error fetching banks:", error);
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
    fetchBanks();
    fetchExpenses();
    fetchIncomes();
  }, []);

  const handleItemSelect = (item, type) => { // Unified handler
    let selectedValue = '';
    switch (type) {
      case 'bank':
        selectedValue = item.name;
        break;
      case 'expense':
        selectedValue = item.description;
        break;
      case 'income':
        selectedValue = item.source;
        break;
      default:
        console.warn('Unknown item type');
        return;
    }
    onItemSelected(selectedValue); // Pass the selected value
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={() => setShowBankContent(!showBankContent)}>
        <View style={styles.toggleButton}>
          <Icon name="chevron-down-outline" size={24} color="black" />
          <Text style={styles.toggleButtonText}>بانک‌ها</Text>
        </View>
        {showBankContent && (
          <FlatList
            data={banks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemSelect(item, 'bank')}>
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
              <TouchableOpacity onPress={() => handleItemSelect(item, 'expense')}>
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
              <TouchableOpacity onPress={() => handleItemSelect(item, 'income')}>
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

export default FromScreen;