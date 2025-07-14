import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const SIDEBAR_WIDTH = 260;

const ActivityDetailScreen: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Sidebar */}
      {sidebarVisible && (
        <View style={[styles.sidebar, { backgroundColor: theme.colors.sectionBackground }]}>
          {/* Profile */}
          <View style={styles.profile}>
            <Image
              source={require('../assets/avatar.jpg')} // Replace with your actual avatar path
              style={styles.avatar}
            />
            <Text style={[styles.name, { color: theme.colors.text }]}>Rachel Foster</Text>
            <Text style={[styles.email, { color: theme.colors.text }]} >rachelfoster1286@gmail.com</Text>
          </View>

          {/* Quick Compose */}
          <TouchableOpacity style={[styles.composeBtn, { backgroundColor: '#1E90FF' }]}>
            <MaterialIcons name="plus" size={18} color="#fff" />
            <Text style={styles.composeText}>Quick Compose</Text>
          </TouchableOpacity>

          {/* Navigation */}
          <View style={styles.navList}>
            {[
              { label: 'Report', icon: 'chart-bar' },
              { label: 'Templates', icon: 'file-document-outline' },
              { label: 'Manage Leads', icon: 'account-group-outline' },
              { label: 'Quick Compose', icon: 'pencil' },
              { label: 'Edit Profile', icon: 'account-cog-outline' },
              { label: 'Logout', icon: 'logout' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.navItem}>
                <MaterialIcons name={item.icon} size={20} color={theme.colors.text} />
                <Text style={[styles.navText, { color: theme.colors.text }]}>{item.label}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.text}
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Main Content */}
      <View
        style={[
          styles.mainContent,
          { marginLeft: sidebarVisible ? SIDEBAR_WIDTH : 0, backgroundColor: theme.colors.background },
        ]}
      >
        {/* Hamburger Button */}
        <TouchableOpacity
          style={[styles.hamburger, { backgroundColor: theme.colors.sectionBackground }]}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        >
          <Ionicons
            name={sidebarVisible ? 'close' : 'menu'}
            size={26}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Report Header */}
          <Text style={[styles.title, { color: theme.colors.text }]}>Report</Text>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <Text style={[styles.entriesLabel, { color: theme.colors.text }]}>Show entries:</Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={{ color: theme.colors.text }}>10 ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="cloud-download-outline" size={18} color={theme.colors.text} />
              <Text style={[styles.controlText, { color: theme.colors.text }]}>Import</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="cloud-upload-outline" size={18} color={theme.colors.text} />
              <Text style={[styles.controlText, { color: theme.colors.text }]}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View style={[styles.table, { backgroundColor: theme.colors.sectionBackground }]}>
            {/* Table Header */}
            <View style={[styles.tableHeader, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.headerCell, { flex: 2, color: theme.colors.text }]}>Time</Text>
              <Text style={[styles.headerCell, { flex: 2, color: theme.colors.text }]}>From</Text>
              <Text style={[styles.headerCell, { flex: 3, color: theme.colors.text }]}>To</Text>
              <Text style={[styles.headerCell, { flex: 1, color: theme.colors.text }]}>Type</Text>
              <Text style={[styles.headerCell, { flex: 1.5, color: theme.colors.text }]}>Status</Text>
              <Text style={[styles.headerCell, { flex: 1.2, color: theme.colors.text }]}>Action</Text>
            </View>

            {/* Table Rows */}
            {[...Array(20)].map((_, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2, color: theme.colors.text }]}>17th May 22, 9:48 AM</Text>
                <Text style={[styles.cell, { flex: 2, color: theme.colors.text }]}>+91 9876 543 210</Text>
                <Text style={[styles.cell, { flex: 3, color: theme.colors.text }]}>8801701653, +250 more</Text>
                <Text style={[styles.cell, { flex: 1, color: theme.colors.text }]}>SMS</Text>
                <Text style={[styles.status, styles.delivered, { flex: 1.5 }]}>
                  DELIVERED
                </Text>
                <View style={[styles.actionIcons, { flex: 1.2 }]}>
                  <Ionicons name="eye-outline" size={18} color={theme.colors.text} />
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#e74c3c"
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ActivityDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    height: '100%',
    padding: 16,
    elevation: 4,
    position: 'absolute',
    zIndex: 10,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 6,
  },
  email: {
    fontSize: 12,
    color: '#777',
  },
  composeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    justifyContent: 'center',
  },
  composeText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  navList: {
    marginTop: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  hamburger: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  entriesLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  dropdownBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  controlText: {
    marginLeft: 4,
    fontSize: 14,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },
  cell: {
    fontSize: 13,
    color: '#333',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  delivered: {
    backgroundColor: '#5597daff',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
