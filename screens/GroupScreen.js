import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => { console.log('Database opened successfully'); },
  error => { console.error('Error opening database:', error); }
);

const GroupScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks',
        [],
        (txObj, resultSet) => {
          const tasksArray = [];
          const cats = new Set();
          for (let i = 0; i < resultSet.rows.length; i++) {
            const item = resultSet.rows.item(i);
            tasksArray.push(item);
            cats.add(item.category);
          }
          setTasks(tasksArray);
          setCategories(Array.from(cats));
        },
        (txObj, error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    });
  }, []);

  const showAlert = (task) => {
    Alert.alert("جزئیات کار", `کار: ${task.task}\nتوضیحات: ${task.description}\nتاریخ: ${task.date}`);
  };

  const handleToggleDone = (taskId, currentValue) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tasks SET isDone = ? WHERE id = ?',
        [currentValue ? 0 : 1, taskId],
        () => {
          // بعد از تغییر، لیست را دوباره بارگذاری کن
          db.transaction(tx2 => {
            tx2.executeSql(
              'SELECT * FROM tasks',
              [],
              (txObj, resultSet) => {
                const tasksArray = [];
                const cats = new Set();
                for (let i = 0; i < resultSet.rows.length; i++) {
                  const item = resultSet.rows.item(i);
                  tasksArray.push(item);
                  cats.add(item.category);
                }
                setTasks(tasksArray);
                setCategories(Array.from(cats));
              }
            );
          });
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>دسته‌بندی کارها</Text>
      {categories.map((cat) => (
        <View key={cat} style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setOpenCategory(openCategory === cat ? null : cat)}
          >
            <Text style={styles.accordionTitle}>{cat}</Text>
            <Ionicons
              name={openCategory === cat ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
          {openCategory === cat && (
            <View style={styles.accordionContent}>
              {tasks.filter(item => item.category === cat).map(item => (
                <View
                  key={item.id}
                  style={[
                    styles.taskItem,
                    item.isDone && { backgroundColor: 'transparent' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* عنوان تسک سمت راست */}
                    <Text
                      style={[
                        styles.taskTitle,
                        { textDecorationLine: item.isDone ? 'line-through' : 'none', marginLeft: 10 },
                      ]}
                    >
                      {item.task}
                    </Text>
                    {/* تیک سمت چپ */}
                    <CheckBox
                      value={!!item.isDone}
                      onValueChange={() => handleToggleDone(item.id, item.isDone)}
                      tintColors={{ true: 'green', false: '#aaa' }}
                      style={{ alignSelf: 'flex-end' }}
                    />
                  </View>
                  {/* دکمه جزئیات زیر عنوان کار */}
                  <TouchableOpacity onPress={() => showAlert(item)}>
                    <Text style={{ color: '#007BFF', alignSelf: 'flex-start', marginTop: 6 }}>جزئیات</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
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
    alignSelf: 'center',
  },
  accordionContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  accordionTitle: {
    fontSize: 18,
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#f0f4ff',
  },
  taskItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e6f0ff',
    backgroundColor: '#e6f0ff',
    flexDirection: 'column',
  },
  taskTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default GroupScreen;