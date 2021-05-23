import { Injectable } from '@angular/core';
import { cloneDeep, groupBy } from 'lodash-es';
import { BehaviorSubject, Subject } from 'rxjs';
import { InlineBlockPicker } from '../../inline-block-picker/inline-block-picker.component';
import {
  ChecksProps,
  ConfiguracionFiltrosAvanzadosMarcas,
  FiltrosAvanzadosChipPicker,
} from '../interfaces/FiltrosAvanzadosModel';
import { FiltrosAplicadosObjModel } from '../sub-comps/filtros-avanzados/filtros-avanzados.component';
import { EnvioHookasFiltradas } from '../sub-comps/hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
import { v4 as uuidv4 } from 'uuid';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { CookieService } from 'ngx-cookie-service';
import { HookasWithSiteMetadata } from '../interfaces/RelationSiteHooka';
import { InlineWorker } from '../classes/InlineWorker';
import { isGoodTag } from '../../../functions/functions';
import { SliderComponentProps } from '../../slider/slider.component';
import { Hooka } from '../interfaces/ModeloHookasBack';
export type ActualItemTypes =
  | 'accesorio'
  | 'cachimba'
  | 'carbon'
  | 'cazoleta'
  | 'esencias'
  | 'manguera'
  | 'melaza'
  | 'sabor';
export type tiposPropiedades =
  | 'marca'
  | 'modelo'
  | 'inputValue'
  | 'etiquetasSeleccionadas'
  | 'precioMin'
  | 'precioMax'
  | 'ocultarAgotados'
  | 'mostrarSoloOfertas'
  | 'mostrarListaSeguimiento'
  | 'proveedor'
  | 'ordenarPrecio';
@Injectable({
  providedIn: 'root',
})
export class HookaService {
  public setFilterPropertyValue(property: tiposPropiedades | any, value: any) {
    this.filtrosAplicados[property] = value as FiltrosAplicadosObjModel;
    this.filterValuesChanged.next(this.filtrosAplicados);
  }
  public set filtrosAplicados(valor: FiltrosAplicadosObjModel) {
    this._filtrosAplicados = valor;
    this.filterValuesChanged.next(this._filtrosAplicados);
  }

  public get filtrosAplicados() {
    return this._filtrosAplicados;
  }
  private _filtrosAplicados: FiltrosAplicadosObjModel = {
    marca: '',
    modelo: '',
    inputValue: '',
    etiquetasSeleccionadas: [],
    precioMin: 0,
    precioMax: 0,
    ocultarAgotados: true,
    mostrarSoloOfertas: false,
    mostrarListaSeguimiento: false,
    ordenarPrecio: 'ASC',
    proveedor: '',
  };
  public cachimbas: Array<HookasWithSiteMetadata> = [];
  public cachimbasSliced: Array<HookasWithSiteMetadata> = [];
  public copiaCachimbas: Array<HookasWithSiteMetadata> = [];
  public MAX_POR_PAGINA: number = 50;
  public PAGINA_ACTUAL: number = 0;
  public MAX_POR_PAGINA_POSIBILIDADES = [5, 25, this.MAX_POR_PAGINA, 100];
  public refrescarFiltrosAvanzados: Subject<void> = new Subject();
  public filterValuesChanged: Subject<FiltrosAplicadosObjModel> = new Subject();
  public changedTypeItemToLoad: BehaviorSubject<ActualItemTypes> =
    new BehaviorSubject(null);
  public latestValueType: ActualItemTypes = 'cachimba';
  constructor(private cookieService: CookieService) {
    this.changedTypeItemToLoad.subscribe((data) => {
      if (data) {
        this.latestValueType = data;
      }
    });
  }

  public obtainTradeMarkAndModel(hookas: Array<HookasWithSiteMetadata>) {
    let objAgrupado = groupBy(hookas, 'marca');
    return cloneDeep(
      Object.keys(objAgrupado).reduce((prev, current, index) => {
        prev.push({
          marca: { clave: current, valor: current.toLowerCase() },
          modelos: objAgrupado[current].map((entry) => {
            let modelo = entry.modelo;
            return { clave: modelo, valor: modelo.toLowerCase() };
          }),
        } as ConfiguracionFiltrosAvanzadosMarcas);
        return prev;
      }, [])
    );
  }

  public obtainTagsFromHookas(
    hookas: Array<HookasWithSiteMetadata>
  ): FiltrosAvanzadosChipPicker {
    let etiquetasUnificadas = hookas.reduce((prev, current, index) => {
      current.etiquetas.forEach((etiqueta) => {
        if (
          !prev.find(
            (entry: string) =>
              entry.toLowerCase() === etiqueta.toLowerCase() ||
              entry.includes(etiqueta)
          ) &&
          etiqueta.length <= 10 &&
          isGoodTag(etiqueta)
        ) {
          prev.push(etiqueta);
        }
      });
      return prev;
    }, []);
    return {
      tags: etiquetasUnificadas.map((entry) => {
        return {
          texto: entry,
          selected: false,
          id: uuidv4(),
        } as InlineBlockPicker;
      }),
    };
  }

  public obtainMininumAndMaxinumPrice(
    hookas: Array<HookasWithSiteMetadata>,
    mininum?: number
  ): SliderComponentProps {
    let arraySoloPrecios: Array<number> = hookas.map(
      (entry) => entry.precioOriginal as number
    );
    arraySoloPrecios = arraySoloPrecios.sort((a, b) => a - b);
    return {
      value: arraySoloPrecios.length > 0 ? arraySoloPrecios[0] : 0,
      highValue:
        arraySoloPrecios.length > 0
          ? arraySoloPrecios[arraySoloPrecios.length - 1]
          : 0,
      options: {
        ceil:
          arraySoloPrecios.length > 0
            ? arraySoloPrecios[arraySoloPrecios.length - 1]
            : 0,
        floor: mininum
          ? mininum
          : arraySoloPrecios.length > 0
          ? arraySoloPrecios[0]
          : 0,
        translate: (value: number, label: LabelType): string => {
          return value + '€';
        },
      },
    };
  }

  public returnChecks(
    hookas: Array<HookasWithSiteMetadata>
  ): Array<ChecksProps> {
    return [
      {
        id: 'ocultarAgotados',
        texto: 'Ocultar agotados',
        valor: this._filtrosAplicados.ocultarAgotados,
        disabled: false,
      },
      {
        id: 'mostrarSoloOfertas',
        texto: 'Mostrar solo ofertas',
        valor: this._filtrosAplicados.mostrarSoloOfertas,
        disabled: false,
      },
      {
        id: 'mostrarListaSeguimiento',
        texto: 'Mostrar solo favoritos',
        valor: this._filtrosAplicados.mostrarListaSeguimiento,
        disabled: false,
      },
    ];
  }

  public async setInitialData(data: Array<HookasWithSiteMetadata>) {
    let filteredData = await this.realizarFiltroNoWorker(data);
    this.cachimbas = filteredData.resultadoFiltraje;
    this.cachimbasSliced = cloneDeep(this.cachimbas);
    this.copiaCachimbas = cloneDeep(this.cachimbas);
    this.cachimbasSliced.length = this.MAX_POR_PAGINA;
    return filteredData;
  }

  public realizarFiltroNoWorker(
    specificArrayData?: Array<HookasWithSiteMetadata>
  ): Promise<EnvioHookasFiltradas> {
    return new Promise((resolve, reject) => {
      const filterHookas = (
        busqueda: FiltrosAplicadosObjModel,
        todasCachimbas: Array<HookasWithSiteMetadata>,
        objetoCookies: any
      ) => {
        return new Promise((resolve, reject) => {
          let res = JSON.parse(JSON.stringify(todasCachimbas));
          if (busqueda.inputValue && busqueda.inputValue != '') {
            res = res.filter((hooka) => {
              let tradeMarkAndModelConcat = (
                hooka.marca + hooka.modelo
              ).toLowerCase();
              return tradeMarkAndModelConcat.includes(
                busqueda.inputValue.toLowerCase()
              );
            });
          }
          //Filtro agotados
          if (
            busqueda.ocultarAgotados != undefined &&
            busqueda.ocultarAgotados === true
          ) {
            res = res.filter((entry) => entry.agotado == false);
          }
          //Filtro solo ofertas
          if (
            busqueda.mostrarSoloOfertas != undefined &&
            busqueda.mostrarSoloOfertas == true
          ) {
            res = res.filter((entry) => entry.precioRebajado != null);
          }
          if (
            busqueda.mostrarListaSeguimiento != undefined &&
            busqueda.mostrarListaSeguimiento == true
          ) {
            let cookiesKeys = Object.keys(objetoCookies);
            res = res.filter((entryHooka) => {
              let resBusqueda = cookiesKeys.find((entry) => {
                if (
                  entry.includes('savedHooka') &&
                  objetoCookies[entry] === entryHooka.linkProducto
                ) {
                  return entry;
                }
                return null;
              });
              if (resBusqueda) return true;
              return false;
            });
          }
          //Filtro marca
          if (busqueda.marca && busqueda.marca != '') {
            res = res.filter((entry) =>
              entry.marca.toLowerCase().includes(busqueda.marca.toLowerCase())
            );
          }
          //Filtro modelo
          if (busqueda.modelo && busqueda.modelo != '') {
            res = res.filter((entry) =>
              entry.modelo.toLowerCase().includes(busqueda.modelo.toLowerCase())
            );
          }

          //Filtro proveedor
          if (busqueda.proveedor && busqueda.proveedor != '') {
            res = res.filter((entry) => {
              return entry.idCompany == busqueda.proveedor;
            });
          }

          //Filtro etiquetas seleccionadas
          if (
            busqueda.etiquetasSeleccionadas &&
            busqueda.etiquetasSeleccionadas.length > 0
          ) {
            res = res.filter((entry) =>
              entry.etiquetas.some((entry) =>
                busqueda.etiquetasSeleccionadas
                  .map((entry) => entry.toLowerCase())
                  .includes(entry.toLowerCase())
              )
            );
          }
          //Filtro precios (rango)
          if (busqueda.precioMax && busqueda.precioMin) {
            res = res.filter((entry) => {
              entry.precioOriginal = entry.precioOriginal as number;
              if (entry.precioOriginal && Number(entry.precioOriginal)) {
                let precioCachimba = Number(entry.precioOriginal);
                let precioMin = Number(busqueda.precioMin);
                let precioMax = Number(busqueda.precioMax);
                return precioCachimba >= precioMin &&
                  precioCachimba <= precioMax
                  ? true
                  : false;
              }
              return false;
            });
          }
          //ORDENACIONES
          if (busqueda.ordenarPrecio) {
            if (busqueda.ordenarPrecio == 'ASC') {
              res = res.sort((entry, entry2) => {
                let precioActualA = entry.precioOriginal as number;
                let precioActualB = entry2.precioOriginal as number;
                return precioActualA - precioActualB;
              });
            } else if (busqueda.ordenarPrecio == 'DESC') {
              res = res.sort((entry, entry2) => {
                let precioActualB = entry2.precioOriginal as number;
                let precioActualA = entry.precioOriginal as number;
                return precioActualB - precioActualA;
              });
            }
          }

          resolve(res);
        }) as Promise<Array<HookasWithSiteMetadata>>;
      };

      filterHookas(
        this.filtrosAplicados,
        specificArrayData
          ? cloneDeep(specificArrayData)
          : cloneDeep(this.copiaCachimbas),
        this.cookieService.getAll()
      ).then((data) => {
        resolve({
          confPaginador: { pageIndex: 0, pageSize: this.MAX_POR_PAGINA },
          resultadoFiltraje: data,
        });
        setTimeout(() => {
          this.refrescarFiltrosAvanzados.next();
        }, 0);
      });
    });
  }
}
