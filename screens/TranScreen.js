import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Keyboard } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
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

  useEffect(() => {
    if (route.params) {
      const { selectedItem, selectedBank } = route.params;

      if (selectedItem) setInput2(selectedItem.amount || '');
      if (selectedBank) setInput3(selectedBank); // تنظیم مقدار input3
    }
  }, [route.params]);

  const showAlert = () => {
    const amount = parseFloat(input2);

    if (!input1 || !input2 || !input3 || !input4 || !input5) { // Added input4 validation
      Alert.alert("خطا", "لطفا همه فیلدها را پر کنید.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("خطا", "مبلغ باید یک عدد مثبت باشد.");
      return;
    }

    Alert.alert("ورودی‌ها", `1: ${input1}\n2: ${input2}\n3: ${input3}\n4: ${input4}\n5: ${input5}`, [{ // Added input4 to the alert
      text: "ثبت", onPress: () => {
        // به‌روزرسانی داده‌ها در پایگاه داده
        Keyboard.dismiss();
      }
    }, { text: "انصراف", style: "cancel" }]);
  };

  const openCalendar = () => {
    navigation.navigate('Calendar', { onDateSelect: setInput1 });
  };

  const openFrom = () => {
    navigation.navigate('FromScreen', {
      onItemSelected: (selectedValue) => {
        setInput3(selectedValue); // تنظیم مقدار input3
        console.log('مقدار انتخاب شده:', selectedValue);
      },
  })};

    const openTo = () => {
    navigation.navigate('ToScreen', { // Assuming you have a ToScreen
      onItemSelected: (selectedValue) => {
        setInput4(selectedValue); // تنظیم مقدار input4
        console.log('مقدار انتخاب شده:', selectedValue);
      },
  })};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اطلاعات تراکنش را وارد کنید</Text>
      <TextInput
        style={styles.input}
        value={input1}
        onChangeText={setInput1}
        onFocus={openCalendar}
        placeholder="تاریخ"
      />
      <TextInput
        style={styles.input}
        value={input2}
        onChangeText={setInput2}
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