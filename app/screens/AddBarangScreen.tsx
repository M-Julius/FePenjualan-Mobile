import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { CompositeNavigationProp } from "@react-navigation/native";
import { JenisBarang } from "../model/barang";
import { Picker } from "@react-native-picker/picker";
import Button from "../components/Button";
import barangAPI from "../services/barang";
import jenisBarangAPI from "../services/jenis-barang";

const AddBarangScreen = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<any, any>;
}) => {
  const pickerRef = useRef<any>();

  const [namaBarang, setNamaBarang] = useState("");
  const [stok, setStok] = useState("");
  const [jumlahTerjual, setJumlahTerjual] = useState("");
  const [tanggalTransaksi, setTanggalTransaksi] = useState(new Date());
  const [jenisBarang, setJenisBarang] = useState("");
  const [listJenisBarang, setListJenisBarang] = useState<JenisBarang[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchDataJenisBarang();
  }, []);

  const handleAddBarang = async () => {
    const body = {
      NamaBarang: namaBarang,
      Stok: parseInt(stok),
      JumlahTerjual: parseInt(jumlahTerjual),
      TanggalTransaksi: tanggalTransaksi.toISOString().split("T")[0],
      JenisBarangID: parseInt(jenisBarang),
    };
    barangAPI.addBarang(body).then((response) => {
      if (response.status) {
        navigation.goBack();
      } else {
        Alert.alert("Gagal menambahkan barang");
      }
    });
  };

  const fetchDataJenisBarang = async () => {
    jenisBarangAPI.getListJenisBarang().then((response) => {
      if (response.status) {
        setListJenisBarang(response.data);
      }
    });
  };

  const onChangeTanggalTransaksi = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || tanggalTransaksi;
    setShowDatePicker(Platform.OS === "ios");
    setTanggalTransaksi(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nama Barang"
        value={namaBarang}
        onChangeText={setNamaBarang}
      />
      <TextInput
        style={styles.input}
        placeholder="Stok"
        value={stok}
        onChangeText={setStok}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Jumlah Terjual"
        value={jumlahTerjual}
        onChangeText={setJumlahTerjual}
        keyboardType="numeric"
      />
      <View style={[styles.input, { alignItems: "center" }]}>
        <TouchableOpacity style={styles.timePicker} onPress={showDatepicker}>
          <Text>{tanggalTransaksi.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tanggalTransaksi}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeTanggalTransaksi}
          />
        )}
      </View>

      <View
        style={[styles.input, { alignItems: "center", paddingHorizontal: 0 }]}
      >
        <TouchableOpacity
          style={styles.dropdownPicker}
          onPress={() => pickerRef.current?.focus()}
        >
          <Picker
            ref={pickerRef as any}
            selectedValue={jenisBarang}
            style={{ width: "100%", height: 40, padding: 0, margin: 0 }}
            onValueChange={(itemValue, itemIndex) => setJenisBarang(itemValue)}
          >
            {listJenisBarang.map((jenisBarang) => {
              return (
                <Picker.Item
                  label={jenisBarang.JenisBarang}
                  value={jenisBarang.JenisBarangID}
                  key={jenisBarang.JenisBarangID}
                />
              );
            })}
          </Picker>
        </TouchableOpacity>
      </View>

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
  datePickerContainer: {
    marginBottom: 20,
  },
  timePicker: {
    width: "100%",
    alignSelf: "center",
    height: 40,
    justifyContent: "center",
  },
  dropdownPicker: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default AddBarangScreen;
