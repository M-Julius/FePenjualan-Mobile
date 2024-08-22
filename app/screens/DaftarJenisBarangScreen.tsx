import { CompositeNavigationProp, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { JenisBarang } from "../model/barang";
import { Feather } from "@expo/vector-icons";
import { colors } from "../themes/colors";
import jenisBarangAPI from "../services/jenis-barang";

export default function DaftarJenisBarangScreen({
  navigation,
}: {
  navigation: CompositeNavigationProp<any, any>;
}) {
  const [data, setData] = useState<JenisBarang[]>([]);
  const [filteredData, setFilteredData] = useState<JenisBarang[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setRefreshing(true);
    jenisBarangAPI.getListJenisBarang().then((res) => {
      if (res.status) {
        setData(res?.data ?? []);
        setFilteredData(res?.data ?? []);
        setRefreshing(false);
      }
    });
  };

  const handleDeleteBarang = async (barangId: number) => {
    jenisBarangAPI.deleteJenisBarang(barangId.toString()).then((res) => {
      if (res.status) {
        fetchData();
      } else {
        Alert.alert("Gagal", res.message);
      }
    });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    const filtered = data.filter((barang) =>
      barang.JenisBarang.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleAddBarang = () => {
    navigation.navigate("AddJenisBarang");
  };

  const handleEditBarang = (barangId: number) => {
    navigation.navigate("EditJenisBarang", { barangId });
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Jenis Barang..."
          value={searchKeyword}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item?.JenisBarangID?.toString() ?? index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.JenisBarang}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => handleEditBarang(item?.JenisBarangID ?? 0)}
              >
                <Feather name="edit" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Hapus Jenis Barang",
                    "Apakah Anda yakin ingin menghapus jenis barang ini?",
                    [
                      { text: "Batal", style: "cancel" },
                      {
                        text: "Hapus",
                        onPress: () =>
                          handleDeleteBarang(item?.JenisBarangID ?? 0),
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Feather name="trash" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddBarang}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    width: "100%",
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  editButton: {
    color: "blue",
    fontSize: 16,
    padding: 10,
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
    padding: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdownPicker: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
});
