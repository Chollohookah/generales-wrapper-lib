import { Injectable } from '@angular/core';
import { cloneDeep, groupBy } from 'lodash-es';
import { Subject } from 'rxjs';
import { InlineBlockPicker } from '../../inline-block-picker/inline-block-picker.component';
import { InlineWorker } from '../classes/InlineWorker';
import {
  ChecksProps,
  ConfiguracionFiltrosAvanzadosMarcas,
  FiltrosAvanzadosChipPicker,
} from '../interfaces/FiltrosAvanzadosModel';
import { HookasWithSiteMetadata } from '../interfaces/RelationSiteHooka';
import { FiltrosAplicadosObjModel } from '../sub-comps/filtros-avanzados/filtros-avanzados.component';
import { EnvioHookasFiltradas } from '../sub-comps/hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
import { v4 as uuidv4 } from 'uuid';
import { SliderComponentProps } from '../../slider/slider.component';
import { Options, LabelType } from '@m0t0r/ngx-slider';
import { CookieService } from 'ngx-cookie-service';
import { flatten, isGoodTag } from '../../functions/functions';
@Injectable({
  providedIn: 'root',
})
export class HookaService {
  public setFilterPropertyValue(
    property:
      | 'marca'
      | 'modelo'
      | 'inputValue'
      | 'etiquetasSeleccionadas'
      | 'precioMin'
      | 'precioMax'
      | 'ocultarAgotados'
      | 'mostrarSoloOfertas'
      | 'mostrarListaSeguimiento'
      | 'ordenarPrecio'
      | any,
    value: any
  ) {
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
    ocultarAgotados: false,
    mostrarSoloOfertas: false,
    mostrarListaSeguimiento: false,
    ordenarPrecio: 'ASC',
  };
  public cachimbas: Array<HookasWithSiteMetadata> = [];
  public cachimbasSliced: Array<HookasWithSiteMetadata> = [];
  public copiaCachimbas: Array<HookasWithSiteMetadata> = [];
  public MAX_POR_PAGINA: number = 50;
  public PAGINA_ACTUAL: number = 0;
  public MAX_POR_PAGINA_POSIBILIDADES = [5, 25, this.MAX_POR_PAGINA, 100];
  public refrescarFiltrosAvanzados: Subject<void> = new Subject();
  public filterValuesChanged: Subject<FiltrosAplicadosObjModel> = new Subject();
  constructor(private cookieService: CookieService) {}

  public realizarFiltro(): Promise<EnvioHookasFiltradas> {
    return new Promise((resolve, reject) => {
      const worker = new InlineWorker(() => {
        const filterHookas = (
          busqueda: FiltrosAplicadosObjModel,
          todasCachimbas: Array<HookasWithSiteMetadata>,
          objetoCookies: any
        ) => {
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
          // @ts-ignore
          this.postMessage({
            filtradas: res,
          });
        };

        // @ts-ignore
        this.onmessage = (evt) => {
          filterHookas(
            evt.data.busqueda,
            evt.data.allShisha,
            evt.data.objetoCookies
          );
        };
      });

      worker.postMessage({
        busqueda: this.filtrosAplicados,
        allShisha: cloneDeep(this.copiaCachimbas),
        objetoCookies: this.cookieService.getAll(),
      });

      let subscription = worker.onmessage().subscribe((data) => {
        resolve({
          confPaginador: { pageIndex: 0, pageSize: this.MAX_POR_PAGINA },
          resultadoFiltraje: data.data.filtradas,
        });
        setTimeout(() => {
          this.refrescarFiltrosAvanzados.next();
        }, 0);
        subscription.unsubscribe();
        worker.terminate();
      });

      let subscription2 = worker.onerror().subscribe((data) => {
        reject(data);
        subscription2.unsubscribe();
      });
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
        valor: false,
        disabled: false,
      },
      {
        id: 'mostrarSoloOfertas',
        texto: 'Mostrar solo ofertas',
        valor: false,
        disabled: false,
      },
      {
        id: 'mostrarListaSeguimiento',
        texto: 'Mostrar solo favoritos',
        valor: false,
        disabled: false,
      },
    ];
  }
}
