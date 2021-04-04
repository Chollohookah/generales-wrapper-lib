import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FiltrosAvanzadosModel,
  InitialConfigInputMaterial,
  ClaveValorModel,
  ConfiguracionFiltrosAvanzadosMarcas,
  FiltrosAvanzadosChipPicker,
  ChecksProps,
  ProviderModel,
} from '../../interfaces/FiltrosAvanzadosModel';
import { HookaService } from '../../services/hooka-service.service';
import { EnvioHookasFiltradas } from '../hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
import { SliderComponentProps } from '../../../slider/slider.component';
export interface FiltrosAplicadosObjModel {
  inputValue: string;
  marca: string;
  modelo: string;
  etiquetasSeleccionadas: Array<string>;
  precioMin: number;
  precioMax: number;
  ocultarAgotados: boolean;
  mostrarSoloOfertas: boolean;
  mostrarListaSeguimiento: boolean;
  ordenarPrecio: 'ASC' | 'DESC';
  proveedor: string;
}
export interface SideEffectsOfEvent {
  keyId: string;
  callback: Function;
}

export interface ConfiguracionComponentes {
  type: 'selector' | 'chip';
  datos: Array<ClaveValorModel>;
  configuracionInicial: InitialConfigInputMaterial;
}

@Component({
  selector: 'lib-filtros-avanzados',
  templateUrl: './filtros-avanzados.component.html',
  styleUrls: ['./filtros-avanzados.component.scss'],
})
export class FiltrosAvanzadosComponent implements OnInit {
  @Input('setNewTradeMarks') set setNewTradeMarks(
    data: Array<ConfiguracionFiltrosAvanzadosMarcas>
  ) {
    if (data && data.length > 0) {
      this.configuracionFiltrosAvanzados.selectores.marcas = data;
      this.configuracionesDeSelectores[
        this.INDICE_MARCA
      ].datos = this.obtainMarks();
    }
  }
  @Input('setNewProviders') set setNewProviders(data: Array<ProviderModel>) {
    if (data) {
      this.configuracionFiltrosAvanzados.selectores.provider = data;
      this.configuracionesDeSelectores[
        this.INDICE_PROVEEDORES
      ].datos = data.map((entry) => {
        return {
          clave: entry.nombre,
          valor: entry.value,
          data: entry,
          type: 'provider-select',
        };
      });
    }
  }

  @Input('setNewChips') set setNewChips(data: FiltrosAvanzadosChipPicker) {
    if (data) {
      this.configuracionFiltrosAvanzados.chipsPickers = data;
    }
  }

  @Input('setNewSlider') set setNewSlider(data: SliderComponentProps) {
    if (data) {
      this.configuracionFiltrosAvanzados.sliderPrecio = data;
    }
  }

  @Input('setNewChecks') set setNewChecks(data: Array<ChecksProps>) {
    if (data) {
      this.configuracionFiltrosAvanzados.checks = data;
    }
  }

  @Output()
  actualizarDesdeSelectores = new EventEmitter<EnvioHookasFiltradas>();
  public configuracionFiltrosAvanzados: FiltrosAvanzadosModel = {
    selectores: {
      marcas: [],
      provider: [],
    },
    chipsPickers: {
      tags: [],
    },
    sliderPrecio: null,
    checks: [],
  };
  public INDICE_MARCA: number = 0;
  public INDICE_PROVEEDORES: number = 1;
  public INDICE_TAGS: number = 3;
  //Configuración selectores
  public configuracionesDeSelectores: Array<ConfiguracionComponentes> = [
    //Marcas
    {
      type: 'selector',
      datos: [],
      configuracionInicial: this.obtainMarksConfig(),
    },
    //Proveedores
    {
      type: 'selector',
      datos: [],
      configuracionInicial: this.obtainProvidersConfig(),
    },
  ];

  //Almacenamiento de datos introducidos p or usuario y hooks
  private listaEfectosSecundarios: Array<SideEffectsOfEvent> = [];

  constructor(private hookaservice: HookaService) {}

  ngOnInit(): void {
    this.listaEfectosSecundarios = [
      /*{
        keyId: 'marca',
        callback: async (marca: string) => {
          this.configuracionesDeSelectores[this.INDICE_PROVEEDORES].datos = this.generateModelsSelectorFromTradeMark(marca);
          this.configuracionesDeSelectores[this.INDICE_PROVEEDORES].configuracionInicial.disabled = false;
          this.hookaservice.setFilterPropertyValue('modelo', '');
          let res: EnvioHookasFiltradas = await this.hookaservice.realizarFiltro();
          this.actualizarDesdeSelectores.emit(res);
        },
      },*/
    ];

    this.configuracionesDeSelectores[
      this.INDICE_MARCA
    ].datos = this.obtainMarks();
  }

  public async receiveChangedValue(claveValor: ClaveValorModel) {
    if (
      this.hookaservice.filtrosAplicados[claveValor.clave] !== claveValor.valor
    ) {
      let busquedaEfectoSecundario = this.listaEfectosSecundarios.find(
        (entry) => entry.keyId === claveValor.clave
      );
      if (busquedaEfectoSecundario) {
        setTimeout(() => {
          busquedaEfectoSecundario.callback(claveValor.valor);
        }, 100);
      }
      this.hookaservice.setFilterPropertyValue(
        claveValor.clave as any,
        claveValor.valor
      );
      let res: EnvioHookasFiltradas = await this.hookaservice.realizarFiltro();
      this.actualizarDesdeSelectores.emit(res);
    }
  }

  public obtainOnlySelectors(): Array<ConfiguracionComponentes> {
    return this.configuracionesDeSelectores.filter(
      (entry) => entry.type == 'selector'
    );
  }

  public obtainMarks(): Array<ClaveValorModel> {
    let marcas = this.configuracionFiltrosAvanzados.selectores.marcas
      .map((entry) => entry.marca)
      .filter((entryFilter) => {
        function isValid(value: Array<string>) {
          return value.every((entryEvery) => {
            return (
              entryEvery != '' && entryEvery != null && entryEvery != undefined
            );
          });
        }
        return isValid([entryFilter.clave, entryFilter.valor]);
      })
      .sort((a, b) => {
        if (a.clave < b.clave) {
          return -1;
        }
        if (a.clave > b.clave) {
          return 1;
        }
        return 0;
      });
    return marcas;
  }
  private generateModelsSelectorFromTradeMark(trademark: string) {
    let busquedaModelos = this.configuracionFiltrosAvanzados.selectores.marcas.find(
      (entry) => entry.marca.valor === trademark
    );
    if (busquedaModelos) {
      return busquedaModelos.modelos;
    }
    return [];
  }

  private obtainMarksConfig(): InitialConfigInputMaterial {
    return {
      idKey: 'marca',
      label: 'Marcas',
      disabled: false,
    };
  }

  private obtainProvidersConfig(): InitialConfigInputMaterial {
    return {
      idKey: 'proveedor',
      label: 'Proveedor',
      disabled: true,
    };
  }
}
