export interface Block {
  id: string;
  dateBLock: Date;
  statuses: Object;
  minedIds: Array<Site>;
}

export interface Site {
  id: string;
  lastUpdate: Date;
  name: string;
  logo: string;
  data: Array<Hooka>;
}

export interface Hooka {
  precioRebajado: string;
  categorias: Array<string>;
  imagen: string;
  cantidad: string;
  shortDesc: string;
  precioOriginal: string | number;
  marca: string;
  modelo: string;
  titulo: string;
  divisa: string;
  etiquetas: Array<string>;
  agotado: boolean;
  linkProducto: string;
  colores: Array<string>;
  fotos: Array<string>;
  specs: Array<any>; //[{tamanyo:''},{altura:''},{material:''},{cazoleta:''},{color:''},{incluyeBase:''},{incluyeManguera:''},{tipo:''},{procedencia:''}]
}
