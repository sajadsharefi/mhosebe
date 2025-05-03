import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-jalaali';

const CalendarScreen = ({ navigation, route }) => {
  const { onDateSelect } = route.params;

  const handleDateSelect = (day) => {
    const selectedDate = moment(day.dateString).format('jYYYY/jM/jD'); // تبدیل به تاریخ شمسی
    onDateSelect(selectedDate); // ارسال تاریخ به صفحه قبل
    navigation.goBack();
  };

  // نام ماه‌های شمسی
  const jalaaliMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>انتخاب تاریخ</Text>
      <Calendar
        onDayPress={handleDateSelect}
        markingType={'single'}
        monthFormat={'yyyy MMMM'}
        renderHeader={(date) => {
          const monthIndex = moment(date).jMonth(); // دریافت شماره ماه شمسی
          const month = jalaaliMonths[monthIndex]; // تبدیل به نام ماه شمسی
          return <Text style={styles.header}>{month}</Text>;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CalendarScreen;