import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import { CompositeNavigationProp } from "@react-navigation/native";
import Button from "../components/Button";
import jenisBarangAPI from "../services/jenis-barang";
import { JenisBarang } from "../model/barang";

interface EditBarangScreenProps {
  route: any;
  navigation: CompositeNavigationProp<any, any>;
}

const EditJenisBarangScreen = ({
  route,
  navigation,
}: EditBarangScreenProps) => {
  const { barangId } = route.params;
  const [jenisBarang, setJenisBarang] = useState("");

  useEffect(() => {
    fetchJenisBarangDetail();
  }, []);

  const fetchJenisBarangDetail = async () => {
    jenisBarangAPI.jenisBarangDetail(barangId).then((response) => {
      if (response.status) {
        setJenisBarang(response.data.JenisBarang);
      }
    });
  };

  const handleEditBarang = async () => {
    const body: JenisBarang = {
      JenisBarang: jenisBarang,
    };
    jenisBarangAPI.editJenisBarang(barangId, body).then((response) => {
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

      <Button title="Edit Jenis Barang" onPress={handleEditBarang} />
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

export default EditJenisBarangScreen;
