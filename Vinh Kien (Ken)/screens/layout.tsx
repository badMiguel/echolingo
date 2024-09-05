// layout.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My App Header</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer Info</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  footer: {
    height: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
});

export default Layout;
