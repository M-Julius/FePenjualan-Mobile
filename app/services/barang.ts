import { Barang } from "../model/barang";

const BASE_URL = process.env.EXPO_PUBLIC_HOST;

const barangAPI = {
  getMostJenisBarang: (startDate?: string, endDate?: string) => {
    let uri = `${BASE_URL}/barang/terjual/terbanyak`;
    if (startDate && endDate) {
      uri += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return fetch(uri)
      .then((response) => response.json())
      .then((dataJson) => dataJson?.data[0] ?? {})
      .catch((error) => console.error("Error fetching data:", error));
  },
  getLeastJenisBarang: (startDate?: string, endDate?: string) => {
    let uri = `${BASE_URL}/barang/terjual/terendah`;
    if (startDate && endDate) {
      uri += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return fetch(uri)
      .then((response) => response.json())
      .then((dataJson) => dataJson?.data[0] ?? {})
      .catch((error) => console.error("Error fetching data:", error));
  },
  getListBarang: (sortBy: string) => {
    return fetch(`${BASE_URL}/barang?sortBy=${sortBy}`)
      .then((response) => response.json())
      .then((dataJson) => dataJson?.data ?? [])
      .catch((error) => console.error("Error fetching data:", error));
  },
  deleteBarang: (id: string) => {
    return fetch(`${BASE_URL}/barang/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  },
  getDetailBarang: (id: string) => {
    return fetch(`${BASE_URL}/barang/${id}`)
      .then((response) => response.json())
      .then((dataJson) => dataJson ?? {})
      .catch((error) => console.error("Error fetching data:", error));
  },
  editBarang: (id: string, data: Barang) => {
    return fetch(`${BASE_URL}/barang/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  },
  addBarang: (data: Barang) => {
    return fetch(`${BASE_URL}/barang`, {
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

export default barangAPI;
