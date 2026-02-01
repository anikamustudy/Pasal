import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { auth } from '../services/api';

const SettingsScreen = ({ navigation }: any) => {
  const { shop, user, logout } = useAppStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth.signOut();
            logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Shop Name:</Text>
          <Text style={styles.value}>{shop?.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Owner:</Text>
          <Text style={styles.value}>{shop?.ownerName || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{shop?.phoneNumber || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Profile Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Change PIN</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cloud-upload-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Sync Now</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="save-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Backup Data</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 20,
  },
});

export default SettingsScreen;
