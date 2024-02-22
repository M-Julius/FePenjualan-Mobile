// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from '../screens/MainPageScreen';
import AddBarangScreen from '../screens/AddBarangScreen';
import EditBarangScreen from '../screens/EditBarangScreen';
import DaftarBarangScreen from '../screens/DaftarBarangScreen';
import DaftarJenisBarangScreen from '../screens/DaftarJenisBarangScreen';
import AddJenisBarangScreen from '../screens/AddJenisBarangScreen';
import EditJenisBarangScreen from '../screens/EditJenisBarangScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainPage" component={MainPage} options={{ title: 'Penjualan' }} />
        <Stack.Screen name="Barang" component={DaftarBarangScreen} options={{ title: 'Daftar Barang' }} />
        <Stack.Screen name="AddBarang" component={AddBarangScreen} options={{ title: 'Tambah Barang' }} />
        <Stack.Screen name="EditBarang" component={EditBarangScreen} options={{ title: 'Edit Barang' }} />
        <Stack.Screen name="JenisBarang" component={DaftarJenisBarangScreen} options={{ title: 'Jenis Barang' }} />
        <Stack.Screen name="AddJenisBarang" component={AddJenisBarangScreen} options={{ title: 'Tambah Jenis Barang' }} />
        <Stack.Screen name="EditJenisBarang" component={EditJenisBarangScreen} options={{ title: 'Edit Jenis Barang' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
