import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../store';
import apiService from '../services/api';
import { DashboardStats } from '../types';

const DashboardScreen = ({ navigation }: any) => {
  const { shop, user } = useAppStore();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayRevenue: 0,
    lowStockCount: 0,
    totalUdhar: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    if (!shop?.id) return;

    setLoading(true);
    try {
      const response = await apiService.getDashboardStats(shop.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      // Use offline data if API fails
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDashboardStats} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.shopName}>{shop?.name || 'Smart Pasal'}</Text>
            <Text style={styles.welcomeText}>Welcome, {user?.displayName || 'User'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
          >
            <Icon name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Icon name="cart-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{stats.todaySales}</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
            <Icon name="cash-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{formatCurrency(stats.todayRevenue)}</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Icon name="alert-circle-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{stats.lowStockCount}</Text>
            <Text style={styles.statLabel}>Low Stock Items</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F44336' }]}>
            <Icon name="book-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{formatCurrency(stats.totalUdhar)}</Text>
            <Text style={styles.statLabel}>Total Udhar</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Billing')}
            >
              <Icon name="cart" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>New Sale</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Icon name="add-circle" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Udhar')}
            >
              <Icon name="book" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>View Udhar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Reports')}
            >
              <Icon name="stats-chart" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Icon name="time-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
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
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});

export default DashboardScreen;
