import { CompositeNavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { TotalTerjual } from "../model/barang";
import { LineChart } from "react-native-chart-kit";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors } from "../themes/colors";
import barangAPI from "../services/barang";

export default function MainPage({
  navigation,
}: {
  navigation: CompositeNavigationProp<any, any>;
}) {
  const [mostSold, setMostSold] = useState<TotalTerjual | undefined>(undefined);
  const [leastSold, setLeastSold] = useState<TotalTerjual | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showPickerStart, setShowPickerStart] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartSold();
  }, []);

  const fetchChartSold = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    barangAPI
      .getMostJenisBarang(startDate, endDate)
      .then((res) => {
        setMostSold(res ?? {});
        barangAPI
          .getLeastJenisBarang(startDate, endDate)
          .then((resLeast) => {
            setLeastSold(resLeast ?? {});
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    type: string
  ) => {
    const currentDate = selectedDate;

    if (type === "start") {
      setShowPickerStart(Platform.OS === "ios");
      setStartDate(currentDate);
    } else {
      setShowPickerEnd(Platform.OS === "ios");
      setEndDate(currentDate);
    }

    if (startDate && currentDate && type === "end") {
      fetchChartSold(
        startDate.toISOString().split("T")[0],
        currentDate.toISOString().split("T")[0]
      );
    } else if (currentDate && endDate && type === "start") {
      fetchChartSold(
        currentDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchChartSold} />
        }
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "45%" }}>
            <Text>Start Date</Text>
            <View style={[styles.input, { alignItems: "center" }]}>
              <TouchableOpacity
                style={styles.timePicker}
                onPress={() => setShowPickerStart(true)}
              >
                <AntDesign
                  name="calendar"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text>
                  {startDate?.toISOString().split("T")[0] ?? "Select..."}
                </Text>
              </TouchableOpacity>
              {showPickerStart && (
                <DateTimePicker
                  key={"start"}
                  testID="dateTimePicker"
                  value={startDate ?? new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(e, val) => onChangeDate(e, val, "start")}
                />
              )}
            </View>
          </View>
          <View style={{ width: "45%" }}>
            <Text>End Date</Text>
            <View style={[styles.input, { alignItems: "center" }]}>
              <TouchableOpacity
                style={styles.timePicker}
                onPress={() => setShowPickerEnd(true)}
              >
                <AntDesign
                  name="calendar"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text>
                  {endDate?.toISOString().split("T")[0] ?? "Select..."}
                </Text>
              </TouchableOpacity>
              {showPickerEnd && (
                <DateTimePicker
                  key={"end"}
                  testID="dateTimePicker"
                  value={endDate ?? new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(e, val) => onChangeDate(e, val, "end")}
                />
              )}
            </View>
          </View>
        </View>
        {!isLoading ? (
          <View>
            <View style={styles.cardInfo}>
              <View style={styles.itemCardInfo}>
                <Ionicons
                  name="trending-up-outline"
                  size={42}
                  color={colors.primary}
                />
                <Text>
                  {mostSold?.JenisBarang} ({mostSold?.TotalTerjual ?? 0})
                </Text>
              </View>
              <View
                style={{ width: 1, height: 80, backgroundColor: "#d9d9d9" }}
              />
              <View style={styles.itemCardInfo}>
                <Ionicons
                  name="trending-down-outline"
                  size={42}
                  color={colors.primary}
                />
                <Text>
                  {leastSold?.JenisBarang} ({leastSold?.TotalTerjual ?? 0})
                </Text>
              </View>
            </View>

            <LineChart
              data={{
                labels: ["Terbanyak", "Terendah"],
                datasets: [
                  {
                    data: [
                      mostSold?.TotalTerjual ?? 0,
                      leastSold?.TotalTerjual ?? 0,
                    ],
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={200}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: colors.primary,
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        ) : (
          <ActivityIndicator
            size={"large"}
            style={{ marginVertical: 50 }}
            color={colors.primary}
          />
        )}
        <View style={styles.rowButton}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Barang")}
            style={styles.button}
          >
            <Feather name="box" size={24} color={colors.primary} />
            <Text style={styles.txtButton}>{"  "}Barang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("JenisBarang")}
            style={styles.button}
          >
            <Feather name="pie-chart" size={24} color={colors.primary} />
            <Text style={styles.txtButton}>{"  "}Jenis Barang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    width: "47%",
    height: 70,
    backgroundColor: "white",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  txtButton: { fontWeight: "bold", fontSize: 16 },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  timePicker: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  rowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardInfo: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemCardInfo: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
