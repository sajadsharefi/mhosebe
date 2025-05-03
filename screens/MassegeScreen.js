import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import { Table, Row } from 'react-native-table-component';

const MassegeScreen = () => {
  const [smsList, setSmsList] = useState([]);
  const [tableHead] = useState(['تاریخ', 'مبلغ', 'وضعیت']);

  useEffect(() => {
    const subscription = SmsListener.addListener(message => {
      if (isBankSms(message.body)) {
        const newSms = parseSms(message.body);
        setSmsList(prevSmsList => [...prevSmsList, newSms]);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isBankSms = (message) => {
    // بررسی پیامک بانکی (شما می‌توانید الگوهای بیشتری اضافه کنید)
    return /بانک|مبلغ/.test(message);
  };

  const parseSms = (message) => {
    // پارس کردن پیامک و استخراج اطلاعات
    const amount = message.match(/\d+/g)?.[0] || 'نامشخص';
    const date = new Date().toLocaleString();
    return { date, amount, status: 'ثبت نشده' };
  };

  const handleRecord = (index) => {
    // عملیات ثبت اطلاعات (مثلاً نمایش یک پیام)
    alert(`ثبت اطلاعات: ${JSON.stringify(smsList[index])}`);
    // می‌توانید اینجا کد ثبت واقعی را اضافه کنید
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>دریافت پیامک بانکی</Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        {
          smsList.map((sms, index) => (
            <TouchableOpacity key={index} onPress={() => handleRecord(index)}>
              <Row data={[sms.date, sms.amount, sms.status]} style={styles.row} textStyle={styles.text} />
            </TouchableOpacity>
          ))
        }
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  row: {
    height: 30,
    backgroundColor: '#fff',
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default MassegeScreen;