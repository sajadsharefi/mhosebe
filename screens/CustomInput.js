// CustomInput.js
import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

const CustomInput = ({ label, value, onChangeText, placeholder }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -10,
    right: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#000',
  },
  input: {
    height: 56,
    borderWidth: 0,
    backgroundColor: '#fff',
  },
});

export default CustomInput;