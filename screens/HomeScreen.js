import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>صفحه اصلی</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Expen')}
      >
        <Text style={styles.buttonText}>هزینه ها</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>بانک ها</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Income')}
      >
        <Text style={styles.buttonText}>در آمد ها</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TranScreen')}
      >
        <Text style={styles.buttonText}>تراکنش جدید</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Massege')}
      >
        <Text style={styles.buttonText}>دریافت پیامک ها</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TransList')}
      >
        <Text style={styles.buttonText}>نمایش تراکنش ها</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Planning')}
      >
        <Text style={styles.buttonText}>برنامه ریزی</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white', // اضافه کردن این خط
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF', // رنگ پس‌زمینه دکمه
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10, // گوشه‌های گرد
    borderWidth: 2, // عرض حاشیه
    borderColor: '#000000', // رنگ حاشیه
  },
  buttonText: {
    color: '#000000', // رنگ متن دکمه
    fontSize: 16,
  },
});

export default HomeScreen;