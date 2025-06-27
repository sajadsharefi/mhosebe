import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import SmsListener from 'react-native-android-sms-listener';

// --- راه‌اندازی دیتابیس ---
const db = SQLite.openDatabase(
  { name: 'data.db', location: 'default' },
  () => {
    console.log('Database opened');
  },
  (error) => {
    console.error('DB Error:', error);
  },
);

// --- تابع درخواست دسترسی به پیامک ---
async function requestSmsPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'دسترسی به پیامک',
          message:
            'اپلیکیشن برای ثبت خودکار تراکنش‌ها به دسترسی خواندن پیامک‌ها نیاز دارد.',
          buttonPositive: 'اجازه می‌دهم',
          buttonNegative: 'لغو',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // برای پلتفرم‌های غیر اندرویدی
}

// --- تابع پردازش متن پیامک بانک ---
function parseBankSms(body) {
  try {
    // استخراج مبلغ از خطی که با "-" شروع می‌شود
    const amountMatch = body.match(/-([\d,]+)/);
    // استخراج تاریخ و ساعت از فرمت XX/XX_XX:XX
    const dateMatch = body.match(/(\d{2}\/\d{2})_(\d{2}:\d{2})/);

    if (amountMatch && dateMatch) {
      const amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      const date = `${dateMatch[1]} ${dateMatch[2]}`;
      return { amount, date };
    }
    return null; // اگر فرمت پیامک مطابقت نداشت
  } catch (e) {
    console.error('Error parsing SMS:', e);
    return null;
  }
}

const MassegeScreen = () => {
  const [notTransactions, setNotTransactions] = useState([]);

  // --- تابع برای بارگذاری تراکنش‌ها از دیتابیس ---
  const loadNotTransactions = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM nottransactions ORDER BY id DESC', // نمایش جدیدترین‌ها در ابتدا
        [],
        (txObj, resultSet) => {
          let temp = [];
          for (let i = 0; i < resultSet.rows.length; ++i) {
            temp.push(resultSet.rows.item(i));
          }
          setNotTransactions(temp);
        },
        (txObj, error) => {
          console.log('Error getting transactions:', error);
        },
      );
    });
  };

  // --- تابع برای درج تراکنش جدید ---
  const insertNotTransaction = (date, amount, description) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO nottransactions (date, amount, from_account, to_account, description) VALUES (?, ?, ?, ?, ?)',
        [date, amount, 'پیامک بانکی', 'نامشخص', description],
        () => {
          console.log('New SMS transaction inserted');
          loadNotTransactions(); // بارگذاری مجدد لیست
        },
        (txObj, error) => {
          console.log('Error inserting transaction:', error);
        },
      );
    });
  };

  useEffect(() => {
    // ۱. بارگذاری اولیه اطلاعات
    loadNotTransactions();

    // ۲. درخواست دسترسی و فعال‌سازی شنود پیامک
    requestSmsPermission().then((granted) => {
      if (granted) {
        console.log('SMS permission granted. Listening for messages...');
        const subscription = SmsListener.addListener((message) => {
          console.log('SMS Received:', message.body);
          const parsed = parseBankSms(message.body);
          if (parsed) {
            console.log('Parsed SMS:', parsed);
            insertNotTransaction(parsed.date, parsed.amount, message.body);
          }
        });

        // ۳. پاک‌سازی در زمان خروج از صفحه
        return () => {
          console.log('Removing SMS listener.');
          subscription.remove();
        };
      } else {
        console.log('SMS permission denied.');
      }
    });
  }, []); // فقط یک بار در زمان لود شدن صفحه اجرا می‌شود

  // --- کامپوننت رندر هر ردیف در لیست ---
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>تاریخ: {item.date}</Text>
      <Text style={styles.rowText}>مبلغ: {item.amount.toLocaleString()} ریال</Text>
      <Text style={styles.rowText}>توضیحات: {item.description}</Text>
    </View>
  );

  // --- کامپوننت رندر جدول خام ---
  const renderTable = () => (
    <ScrollView horizontal style={styles.tableContainer}>
      <View>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeader}>ID</Text>
          <Text style={styles.tableCellHeader}>تاریخ</Text>
          <Text style={styles.tableCellHeader}>مبلغ</Text>
          <Text style={styles.tableCellHeader}>توضیحات</Text>
        </View>
        {notTransactions.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={styles.tableCell}>{item.id}</Text>
            <Text style={styles.tableCell}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.amount}</Text>
            <Text style={styles.tableCell} numberOfLines={1}>{item.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تراکنش‌های ثبت نشده از پیامک</Text>
      <FlatList
        data={notTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>هنوز تراکنشی ثبت نشده است.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Text style={styles.tableTitle}>جدول خام دیتابیس (برای بررسی)</Text>
      {renderTable()}
    </View>
  );
};

// --- استایل‌ها ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  row: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  rowText: {
    fontSize: 14,
    color: '#444',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  tableContainer: {
    maxHeight: 250,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableCellHeader: {
    minWidth: 150,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  tableCell: {
    minWidth: 150,
    textAlign: 'center',
    color: '#555',
  },
});

export default MassegeScreen;