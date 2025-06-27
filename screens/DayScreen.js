import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import SQLite from 'react-native-sqlite-storage';
import CheckBox from '@react-native-community/checkbox';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => { console.error('DB Error:', error); }
);

const DayScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tasks WHERE date = ?',
          [selectedDate],
          (txObj, resultSet) => {
            const data = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              data.push(resultSet.rows.item(i));
            }
            setTasks(data);
          },
          (txObj, error) => {
            setTasks([]);
            console.error('Error fetching tasks:', error);
          }
        );
      });
    } else {
      setTasks([]);
    }
  }, [selectedDate]);

  const handleToggleDone = (taskId, currentValue) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tasks SET isDone = ? WHERE id = ?',
        [currentValue ? 0 : 1, taskId],
        () => {
          // بعد از تغییر، لیست را دوباره بارگذاری کن
          db.transaction(tx2 => {
            tx2.executeSql(
              'SELECT * FROM tasks WHERE date = ?',
              [selectedDate],
              (txObj, resultSet) => {
                const data = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                  data.push(resultSet.rows.item(i));
                }
                setTasks(data);
              }
            );
          });
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <DatePicker
        isGregorian={false}
        mode="calendar"
        selected={selectedDate}
        onSelectedChange={setSelectedDate}
        style={styles.datePicker}
      />
      <View style={styles.tasksBox}>
        <View style={styles.headerRow}>
          <Text style={styles.tasksTitle}>کارهای روز</Text>
          <Text style={styles.selectedDate}>{selectedDate}</Text>
        </View>
        {tasks.length === 0 ? (
          <Text style={styles.noTask}>کاری برای این روز ثبت نشده است.</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* دسته */}
                  <Text style={styles.categoryText}>{item.category}</Text>
                  {/* کار */}
                  <Text style={styles.taskText}>{item.task}</Text>
                  {/* چک‌باکس انتهای سطر */}
                  <CheckBox
                    value={!!item.isDone}
                    onValueChange={() => handleToggleDone(item.id, item.isDone)}
                    tintColors={{ true: 'green', false: '#aaa' }}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 0,
    justifyContent: 'flex-start',
  },
  datePicker: {
    alignSelf: 'stretch',
    marginTop: 0,
  },
  tasksBox: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 100,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start', // سمت راست
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  noTask: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  taskText: {
    fontSize: 16,
    textAlign: 'right',
  },
  categoryText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 12,
  },
});

export default DayScreen;