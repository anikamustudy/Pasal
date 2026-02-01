import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const BillingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Billing</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Fast billing screen</Text>
        <Text style={styles.subtext}>
          Create sales, scan barcodes, and generate invoices
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholder: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default BillingScreen;
