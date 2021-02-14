export interface ComparadorHookasIconoConfig {
  nombre: string;
  alHacerClick: Function;
  condition: Function;
  customClass: string;
}

export interface ComparadorHookasInputModel {
  textoInputAntesDeClickear: string;
  placeholderAlComenzarAEscribir: string;
  iconoFiltro: ComparadorHookasIconoConfig;
  iconoClear: ComparadorHookasIconoConfig;
  iconoSort?: ComparadorHookasIconoConfig;

  estadoAnimacion: 'empezada' | 'terminada';
  estadoExpansion: 'abierta' | 'cerrada';
}
