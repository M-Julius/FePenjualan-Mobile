export interface Barang {
  ID?: number;
  NamaBarang: string;
  Stok: number;
  JumlahTerjual: number;
  TanggalTransaksi: string;
  JenisBarang?: string;
  JenisBarangID: number;
}

export interface JenisBarang {
  JenisBarangID?: number;
  JenisBarang: string;
}

export interface TotalTerjual {
  JenisBarangID: number;
  JenisBarang: string;
  TotalTerjual: number;
}
