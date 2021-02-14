export type BootstrapColors =
  | 'primary'
  | 'secondary'
  | 'ternary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'muted'
  | 'white';

export interface AnunciosHookas {
  texto: 'AGOTADO' | 'OFERTA' | 'ULTIMOS' | undefined;
  color: BootstrapColors;
  textColor: BootstrapColors;
  onClick?: Function;
  customClass?: string;
  extraData?: any;
}
