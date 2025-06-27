import React, { useState } from 'react';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const CalendarScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const defaultDate = getFormatedDate(new Date(), 'jYYYY/jMM/jDD');
  const [selectedDate, setSelectedDate] = useState('');

  const previousInputs = route.params?.currentInputs || {};

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const fromScreen = route.params?.fromScreen;
    const currentInputs = previousInputs || {};
    if (fromScreen === 'TaskScreen') {
      navigation.navigate('TaskScreen', {
        ...currentInputs,
        selectedDate: date,
      });
    } else if (fromScreen === 'TranScreen') {
      navigation.navigate('TranScreen', {
        ...currentInputs,
        selectedDate: date,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View>
      <DatePicker
        isGregorian={false}
        selected={selectedDate}
        onSelectedChange={handleDateSelect}
        mode="calendar"
      />
    </View>
  );
};

export default CalendarScreen;