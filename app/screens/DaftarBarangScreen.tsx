import { CompositeNavigationProp, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Barang } from "../model/barang";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { colors } from "../themes/colors";
import barangAPI from "../services/barang";

export default function DaftarBarangScreen({
  navigation,
}: {
  navigation: CompositeNavigationProp<any, any>;
}) {
  const pickerRef = useRef<any>();

  const [data, setData] = useState<Barang[]>([]);
  const [filteredData, setFilteredData] = useState<Barang[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("nama");

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [sortBy])
  );

  const fetchData = async () => {
    setRefreshing(true);
    barangAPI.getListBarang(sortBy).then((res) => {
      setData(res);
      setFilteredData(res);
      setRefreshing(false);
    });
  };

  const handleDeleteBarang = async (barangId: number) => {
    barangAPI.deleteBarang(barangId.toString()).then((res) => {
      if (res?.status) {
        fetchData();
      } else {
        Alert.alert("Gagal", "Gagal menghapus barang!");
      }
    });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    const filtered = data.filter((barang) =>
      barang.NamaBarang.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleAddBarang = () => {
    navigation.navigate("AddBarang");
  };

  const handleEditBarang = (barangId: number) => {
    navigation.navigate("EditBarang", { barangId });
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Barang..."
          value={searchKeyword}
          onChangeText={handleSearch}
        />
        <View
          style={[
            styles.searchInput,
            { alignItems: "center", paddingHorizontal: 0 },
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownPicker}
            onPress={() => pickerRef.current?.focus()}
          >
            <Picker
              ref={pickerRef as any}
              selectedValue={sortBy}
              placeholder="Sort By..."
              prompt="Sort By..."
              style={{ width: "100%", height: 40, padding: 0, margin: 0 }}
              onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}
            >
              <Picker.Item label={"Nama Barang"} value={"nama"} />
              <Picker.Item label={"Tanggal Transaksi"} value={"tanggal"} />
            </Picker>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?.ID?.toString() ?? index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemText}>Barang: {item.NamaBarang}</Text>
              <Text style={styles.itemText}>Stok: {item.Stok}</Text>
              <Text style={styles.itemText}>Terjual: {item.JumlahTerjual}</Text>
              <Text style={styles.itemText}>
                Jenis Barang: {item.JenisBarang}
              </Text>
              <Text style={styles.itemText}>
                Tanggal: {item.TanggalTransaksi.toString().split("T")[0]}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => handleEditBarang(item?.ID ?? 0)}
              >
                <Feather name="edit" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Hapus Barang",
                    "Apakah Anda yakin ingin menghapus barang ini?",
                    [
                      { text: "Batal", style: "cancel" },
                      {
                        text: "Hapus",
                        onPress: () => handleDeleteBarang(item?.ID ?? 0),
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
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 1,
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
