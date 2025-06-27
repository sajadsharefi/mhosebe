import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

const PlanningScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="برنامه ریزی روزانه"
          onPress={() => navigation.navigate('DayScreen')}
        />
        <Button
          title="کارهای گروهی"
          onPress={() => navigation.navigate('GroupScreen')}
        />
        <Button
          title="اضافه کردن کار"
          onPress={() => navigation.navigate('TaskScreen')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PlanningScreen;