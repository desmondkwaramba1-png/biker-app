import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import HomeScreen from '../screens/customer/HomeScreen';
import SendDeliveryScreen from '../screens/customer/SendDeliveryScreen';
import TrackDeliveryScreen from '../screens/customer/TrackDeliveryScreen';
import DeliveryHistoryScreen from '../screens/customer/DeliveryHistoryScreen';
import DeliveryRequestsScreen from '../screens/biker/DeliveryRequestsScreen';
import ActiveDeliveryScreen from '../screens/biker/ActiveDeliveryScreen';
import EarningsScreen from '../screens/biker/EarningsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icon = (emoji) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

const CustomerTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('🏠') }} />
    <Tab.Screen name="History" component={DeliveryHistoryScreen} options={{ tabBarIcon: icon('📦') }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('👤') }} />
  </Tab.Navigator>
);

const BikerTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary }}>
    <Tab.Screen name="Requests" component={DeliveryRequestsScreen} options={{ tabBarIcon: icon('🏍️') }} />
    <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarIcon: icon('💰') }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('👤') }} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

const AppStack = ({ isBiker }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={isBiker ? BikerTabs : CustomerTabs} />
    <Stack.Screen name="SendDelivery" component={SendDeliveryScreen} options={{ headerShown: true, title: 'New Delivery' }} />
    <Stack.Screen name="TrackDelivery" component={TrackDeliveryScreen} options={{ headerShown: true, title: 'Track Delivery' }} />
    <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} options={{ headerShown: true, title: 'Active Delivery' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <AppStack isBiker={user.isBiker} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
