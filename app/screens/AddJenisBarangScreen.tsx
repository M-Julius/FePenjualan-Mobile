import React, { useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import { CompositeNavigationProp } from "@react-navigation/native";
import Button from "../components/Button";
import jenisBarangAPI from "../services/jenis-barang";

const AddJenisBarangScreen = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<any, any>;
}) => {
  const [jenisBarang, setJenisBarang] = useState("");

  const handleAddBarang = async () => {
    jenisBarangAPI
      .addJenisBarang({ JenisBarang: jenisBarang })
      .then((response) => {
        if (response.status) {
          navigation.goBack();
        } else {
          Alert.alert("Gagal", response.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Jenis Barang"
        value={jenisBarang}
        onChangeText={setJenisBarang}
      />
      <Button title="Tambah Barang" onPress={handleAddBarang} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddJenisBarangScreen;
