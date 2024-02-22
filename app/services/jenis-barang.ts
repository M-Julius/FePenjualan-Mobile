import { JenisBarang } from "../model/barang";

const BASE_URL = process.env.EXPO_PUBLIC_HOST;

const jenisBarangAPI = {
  getListJenisBarang: () => {
    return fetch(`${BASE_URL}/jenis-barang`)
      .then((response) => response.json())
      .then((dataJson) => dataJson ?? {})
      .catch((error) => console.error("Error fetching data:", error));
  },
  jenisBarangDetail: (id: string) => {
    return fetch(`${BASE_URL}/jenis-barang/${id}`)
      .then((response) => response.json())
      .then((dataJson) => dataJson ?? {})
      .catch((error) => console.error("Error fetching data:", error));
  },
  editJenisBarang: (id: string, data: JenisBarang) => {
    return fetch(`${BASE_URL}/jenis-barang/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  },
  deleteJenisBarang: (id: string) => {
    return fetch(`${BASE_URL}/jenis-barang/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  },
  addJenisBarang: (data: JenisBarang) => {
    return fetch(`${BASE_URL}/jenis-barang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  },
};

export default jenisBarangAPI;
