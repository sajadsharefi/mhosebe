import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // صفحه اصلی
import ProfileScreen from './screens/ProfileScreen'; // صفحه پروفایل
import ExpenScreen from './screens/ExpenScreen'; // صفحه پروفایل
import IncomeScreen from './screens/IncomeScreen'; // صفحه پروفایل
import InsertBank from './screens/InsertBank'; // صفحه پرونده ها
import InsertExpen from './screens/InsertExpen'; // صفحه پرونده ها
import InsertIncome from './screens/InsertIncome'; // صفحه پرونده ها
import TranScreen from './screens/TranScreen'; // صفحه پرونده ها
import CalendarScreen from './screens/CalendarScreen'; // مسیر صحیح را وارد کنید
import FromScreen from './screens/FromScreen'; // مسیر صحیح را وارد کنید
import ToScreen from './screens/ToScreen'; // مسیر صحیح را وارد کنید
import MassegeScreen from './screens/MassegeScreen'; // مسیر صحیح را وارد کنید
import TranListScreen from './screens/TranListScreen'; // مسیر صحیح را وارد کنید
import PlanningScreen from './screens/PlanningScreen'; // مسیر صحیح را وارد کنید
import DayScreen from './screens/DayScreen'; // مسیر صحیح را وارد کنید
import GroupScreen from './screens/GroupScreen'; // مسیر صحیح را وارد کنید
import TaskScreen from './screens/TaskScreen'; // مسیر صحیح را وارد کنید
import SQLite from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {},
  error => {
    console.error(error);
  }
);

interface bank {
  id: number;
  name: string;
  amount: number;
}

const Stack = createStackNavigator();

const CustomHeader = ({ navigation, title, icon }) => {
  return (
    <View style={styles.container} >
      <Text style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
      <Ionicons style={styles.icon} name={icon} size={24} color="black" />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const CustomHeadertwo = ({ navigation, title, icon }) => {
  return (
    <View style={styles.container} >
      <Text style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
      <Ionicons style={styles.icon} name={icon} size={24} color="black" />
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white', // اضافه کردن این خط
    borderBottomWidth: 2, // ضخامت حاشیه
    borderBottomColor: '#2222a8', // رنگ حاشیه
    paddingBottom: 5, // فضای بین متن و حاشیه
  },
  icon: {
    marginLeft: 20,
  }
});

function App() {

  useEffect(() => {
    db.transaction(tx => {
      // پاک کردن جدول‌ها در صورت نیاز
      // tx.executeSql('DROP TABLE IF EXISTS banks;', [], 
      //   () => { console.log('Table banks dropped successfully'); },
      //   error => { console.error('Error dropping banks table: ', error); }
      // );
  
      // tx.executeSql('DROP TABLE IF EXISTS expenses;', [], 
      //   () => { console.log('Table expenses dropped successfully'); },
      //   error => { console.error('Error dropping expenses table: ', error); }
      // );
  
      // tx.executeSql('DROP TABLE IF EXISTS income;', [], 
      //   () => { console.log('Table income dropped successfully'); },
      //   error => { console.error('Error dropping income table: ', error); }
      // );

      // tx.executeSql('DROP TABLE IF EXISTS transactions;', [], 
      //   () => { console.log('Table income dropped successfully'); },
      //   error => { console.error('Error dropping income table: ', error); }
      // );
  
      // ایجاد جدول برای بانک‌ها
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS banks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          amount REAL NOT NULL
        );`,
        [],
        () => { console.log('Table for banks created successfully'); },
        error => { console.error('Error creating banks table: ', error); }
      );
  
      // ایجاد جدول برای هزینه‌ها بدون ستون تاریخ
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          amount REAL NOT NULL
        );`,
        [],
        () => { console.log('Table for expenses created successfully'); },
        error => { console.error('Error creating expenses table: ', error); }
      );
  
      // ایجاد جدول برای درآمدها بدون ستون تاریخ
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS incomes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source TEXT NOT NULL,
          amount REAL NOT NULL
        );`,
        [],
        () => { console.log('Table for income created successfully'); },
        error => { console.error('Error creating income table: ', error); }
      );

      // ایجاد جدول برای تراکنش‌ها
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
              date TEXT,
              amount REAL,
              from_account TEXT,
              to_account TEXT,
              description TEXT
          );`,
          [],
          () => {
            console.log('Table transactions created successfully');
          },
          (txObj, error) => {
            console.log('Error creating table transactions:', error);
          }
        );
      });

      // ایجاد جدول برای تراکنش‌های ثبت نشده
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS nottransactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            amount REAL,
            from_account TEXT,
            to_account TEXT,
            description TEXT
        );`,
        [],
        () => {
          console.log('Table transactions created successfully');
        },
        (txObj, error) => {
          console.log('Error creating table transactions:', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
        [],
        () => {
          console.log('Table accounts created successfully');
        },
        (txObj, error) => {
          console.log('Error creating table accounts:', error);
        }
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT,
          task TEXT,
          description TEXT,
          date TEXT
        );`,
        [],
        () => { console.log('Table created successfully'); },
        (tx, error) => { console.error('Error creating table:', error); }
      );

      // اضافه کردن ستون isDone اگر وجود ندارد
      tx.executeSql(
        "ALTER TABLE tasks ADD COLUMN isDone INTEGER DEFAULT 0",
        [],
        () => { console.log('Column isDone added to tasks'); },
        (tx, error) => {
          // اگر خطا داد که ستون وجود دارد، نادیده بگیر
          if (!error.message.includes('duplicate column name')) {
            console.error('Error adding isDone column:', error);
          }
        }
      );
        
    });
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* صفحه اصلی با هدر ساده */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'صفحه اصلی',
            headerShown: true }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            header: (props) => <CustomHeadertwo {...props} title="بانک ها" icon="link-outline" />,
          }} 
        />
        <Stack.Screen 
          name="Expen" 
          component={ExpenScreen} 
          options={{ 
            header: (props) => <CustomHeadertwo {...props} title="هزینه ها" icon="link-outline" />,
          }} 
        />
        <Stack.Screen 
          name="Income" 
          component={IncomeScreen} 
          options={{ 
            header: (props) => <CustomHeadertwo {...props} title="در آمد ها" icon="link-outline" />,
          }} 
        />
        <Stack.Screen 
          name="Planning" 
          component={PlanningScreen} 
          options={{ 
            header: (props) => <CustomHeadertwo {...props} title="برنامه ریزی" icon="link-outline" />,
          }} 
        />
        <Stack.Screen 
          name="InsertBank" 
          component={InsertBank} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن حساب" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen 
          name="InsertExpen" 
          component={InsertExpen} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن هزینه ها" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen 
          name="InsertIncome" 
          component={InsertIncome} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن درآمد ها" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen 
          name="TranScreen" 
          component={TranScreen} 
          options={{ 
            header: (props) => <CustomHeadertwo {...props} title="اضافه کردن تراکنش جدید" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="FromScreen" component={FromScreen} />
        <Stack.Screen 
          name="ToScreen" 
          component={ToScreen} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن تراکنش جدید" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen 
          name="Massege" 
          component={MassegeScreen} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن تراکنش جدید" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen 
          name="TransList" 
          component={TranListScreen} 
          options={{ 
            header: (props) => <CustomHeader {...props} title="اضافه کردن تراکنش جدید" icon="duplicate-outline" />,
          }} 
        />
        <Stack.Screen name="DayScreen" component={DayScreen} />
        <Stack.Screen name="GroupScreen" component={GroupScreen} />
        <Stack.Screen name="TaskScreen" component={TaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;