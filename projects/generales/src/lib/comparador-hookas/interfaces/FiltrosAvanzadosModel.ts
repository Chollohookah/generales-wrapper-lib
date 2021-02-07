import { InlineBlockPicker } from '../../inline-block-picker/inline-block-picker.component';
import { SliderComponentProps } from '../../slider/slider.component';

export interface FiltrosAvanzadosModel {
  selectores: FiltrosAvanzadosSelectoresModel;
  chipsPickers: FiltrosAvanzadosChipPicker;
  sliderPrecio: SliderComponentProps;
  checks: Array<ChecksProps>;
}

export interface ChecksProps {
  id: string;
  texto: string;
  valor: boolean;
  disabled: boolean;
}

export interface FiltrosAvanzadosSelectoresModel {
  marcas: Array<ConfiguracionFiltrosAvanzadosMarcas>;
  origen: Array<ClaveValorBandera>;
}

export interface FiltrosAvanzadosChipPicker {
  tags: Array<InlineBlockPicker>;
}

export interface ConfiguracionFiltrosAvanzadosMarcas {
  marca: ClaveValorModel;
  modelos: Array<ClaveValorModel>;
}

export interface InitialConfigInputMaterial {
  idKey: string;
  label: string;
  disabled: boolean;
  customCssClass?: string;
}

export interface ConfiguracionTotalSelector {
  datos: Array<ClaveValorModel>;
  configuracionInicial: InitialConfigInputMaterial;
}

export interface ClaveValorModel {
  clave: string;
  valor: any;
  data?: any;
}

export interface ClaveValorBandera extends ClaveValorModel {
  bandera?: string;
}
