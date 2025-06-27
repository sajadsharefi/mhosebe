import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Keyboard } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.error('Error opening database:', error);
  }
);

const TranScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [input1, setInput1] = useState(''); // تاریخ
  const [input2, setInput2] = useState(''); // مبلغ
  const [input3, setInput3] = useState(''); // از حساب
  const [input4, setInput4] = useState(''); // به حساب
  const [input5, setInput5] = useState(''); // توضیحات
  const [fromAccountId, setFromAccountId] = useState(null);
  const [toAccountId, setToAccountId] = useState(null);
  const [fromAccountTable, setFromAccountTable] = useState('');
  const [toAccountTable, setToAccountTable] = useState('');
  const [fromAccountName, setFromAccountName] = useState('');
  const [toAccountName, setToAccountName] = useState('');

  useEffect(() => {
    if (route.params) {
      const { selectedDate, selectedAmount, selectedFromAccount, selectedToAccount } = route.params;

      if (selectedDate) setInput1(selectedDate); // قرار دادن تاریخ در input1
      if (selectedAmount) setInput2(selectedAmount.amount || '');

      if (selectedFromAccount) {
        setFromAccountName(selectedFromAccount.name || '');
        setInput3(selectedFromAccount.name || '');
        setFromAccountId(selectedFromAccount.id || null);
        setFromAccountTable(selectedFromAccount.tableName || '');
      }

      if (selectedToAccount) {
        setToAccountName(selectedToAccount.name || '');
        setInput4(selectedToAccount.name || '');
        setToAccountId(selectedToAccount.id || null);
        setToAccountTable(selectedToAccount.tableName || '');
      }
    }
  }, [route.params]);

  const formatAmount = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, ''); // حذف کاراکترهای غیر عددی
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // فرمت کردن به عدد با کاما
  };

  const handleAmountChange = (value) => {
    setInput2(formatAmount(value));
  };

  const showAlert = () => {
    if (!input1 || !input2 || !input3 || !input4 || !input5) {
      Alert.alert("خطا", "لطفا همه فیلدها را پر کنید.");
      return;
    }

    const amount = parseFloat(input2.replace(/,/g, '')); // حذف کاماها برای محاسبه

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("خطا", "مبلغ باید یک عدد مثبت باشد.");
      return;
    }

    Alert.alert("ورودی‌ها", `تاریخ: ${input1}\nمبلغ: ${input2}\nاز حساب: ${input3}\nبه حساب: ${input4}\nتوضیحات: ${input5}`, [
      {
        text: "ثبت",
        onPress: () => {
          Keyboard.dismiss();
          db.transaction(tx => {
            // Update the "from" account
            if (fromAccountTable && fromAccountId) {
              tx.executeSql(
                `UPDATE ${fromAccountTable} SET amount = amount - ? WHERE id = ?`,
                [amount, fromAccountId],
                (txObj, resultSet) => {
                  console.log('From Account updated successfully:', resultSet.rowsAffected);
                },
                (txObj, error) => {
                  console.log('Error updating From Account:', error);
                  Alert.alert("خطا", "خطا در بروزرسانی حساب مبدا.");
                  return; // Exit the transaction if update fails
                }
              );
            }

            // Update the "to" account
            if (toAccountTable && toAccountId) {
              tx.executeSql(
                `UPDATE ${toAccountTable} SET amount = amount + ? WHERE id = ?`,
                [amount, toAccountId],
                (txObj, resultSet) => {
                  console.log('To Account updated successfully:', resultSet.rowsAffected);
                },
                (txObj, error) => {
                  console.log('Error updating To Account:', error);
                  Alert.alert("خطا", "خطا در بروزرسانی حساب مقصد.");
                  return; // Exit the transaction if update fails
                }
              );
            }

            // Insert the transaction
            tx.executeSql(
              'INSERT INTO transactions (date, amount, from_account, to_account, description) VALUES (?, ?, ?, ?, ?)',
              [input1, input2, input3, input4, input5],
              (txObj, resultSet) => {
                console.log('Transaction inserted successfully:', resultSet.insertId);
                setInput1('');
                setInput2('');
                setInput3('');
                setInput4('');
                setInput5('');
                Alert.alert("موفق", "تراکنش با موفقیت ثبت شد.");
              },
              (txObj, error) => {
                console.log('Error inserting transaction:', error);
                Alert.alert("خطا", "خطا در ثبت تراکنش.");
              }
            );
          }, (error) => {
            console.log('Transaction error:', error);
            Alert.alert("خطا", "خطا در ثبت تراکنش.");
          });
        }
      },
      { text: "انصراف", style: "cancel" }
    ]);
  };

  const openCalendar = () => {
    navigation.navigate('Calendar'); // فقط هدایت به تقویم
  };

  const openFrom = () => {
    navigation.navigate('FromScreen', {
      onItemSelected: (selectedValue) => {
        if (selectedValue) {
          setFromAccountName(selectedValue.name || '');
          setInput3(selectedValue.name || '');
          setFromAccountId(selectedValue.id || null);
          setFromAccountTable(selectedValue.tableName || '');
        }
      },
    });
  };

  const openTo = () => {
    navigation.navigate('ToScreen', {
      onItemSelected: (selectedValue) => {
        if (selectedValue) {
          setToAccountName(selectedValue.name || '');
          setInput4(selectedValue.name || '');
          setToAccountId(selectedValue.id || null);
          setToAccountTable(selectedValue.tableName || '');
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اطلاعات تراکنش را وارد کنید</Text>
      <TextInput
        style={styles.input}
        value={input1}
        onChangeText={setInput1}
        onFocus={openCalendar} // استفاده از onFocus برای باز کردن تقویم
        placeholder="تاریخ"
      />
      <TextInput
        style={styles.input}
        value={input2}
        onChangeText={handleAmountChange} // استفاده از تابع فرمت‌کننده
        placeholder="مبلغ"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={input3}
        onChangeText={setInput3}
        onFocus={openFrom}
        placeholder="از حساب"
      />
      <TextInput
        style={styles.input}
        value={input4}
        onChangeText={setInput4}
        onFocus={openTo}
        placeholder="به حساب"
      />
      <TextInput
        style={styles.input}
        value={input5}
        onChangeText={setInput5}
        placeholder="توضیحات"
      />
      <Button title="ثبت" onPress={showAlert} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
});

export default TranScreen;