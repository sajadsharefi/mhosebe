import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, BackHandler, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => { console.log('Database opened successfully'); },
  error => { console.error('Error opening database:', error); }
);

const TaskScreen = ({ navigation, route }) => {
  const [category, setCategory] = useState('');
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (route.params) {
      setDate(route.params.selectedDate || '');
      setCategory(route.params.category || '');
      setTask(route.params.task || '');
      setDescription(route.params.description || '');
    }
  }, [route.params]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Planning');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => navigation.navigate('Planning')}
        >
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddTask = () => {
    if (!category || !task || !description || !date) {
      Alert.alert("خطا", "لطفاً همه فیلدها را پر کنید.");
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (category, task, description, date) VALUES (?, ?, ?, ?)',
        [category, task, description, date],
        () => {
          Alert.alert("ثبت شد", "کار شما با موفقیت ثبت شد.");
          setCategory('');
          setTask('');
          setDescription('');
          setDate('');
        },
        (tx, error) => {
          console.error('Error inserting task:', error);
          Alert.alert("خطا", "خطا در ثبت کار.");
        }
      );
    });
  };

  const openCalendar = () => {
    navigation.navigate('Calendar', {
      fromScreen: 'TaskScreen',
      selectedDate: date,
      currentInputs: {
        category,
        task,
        description,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ثبت کار جدید</Text>
      <TextInput
        style={styles.input}
        placeholder="دسته بندی"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="کار"
        value={task}
        onChangeText={setTask}
      />
      <TextInput
        style={styles.input}
        placeholder="توضیحات"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        value={date}
        onFocus={openCalendar}
        placeholder="تاریخ"
      />
      <Button title="ثبت کار" onPress={handleAddTask} color="#007BFF" />
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

export default TaskScreen;