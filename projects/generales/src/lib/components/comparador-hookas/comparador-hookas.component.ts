import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
} from '@angular/core';
import { ComparadorHookasInputModel } from './interfaces/ComparadorHooksInputModel';
import { Site, Hooka, Block } from './interfaces/ModeloHookasBack';
import { HookasWithSiteMetadata } from './interfaces/RelationSiteHooka';
import { cloneDeep } from 'lodash-es';
import { PageEvent } from '@angular/material/paginator';
import {
  ChecksProps,
  ClaveValorModel,
  ConfiguracionFiltrosAvanzadosMarcas,
  FiltrosAvanzadosChipPicker,
  ProviderModel,
} from './interfaces/FiltrosAvanzadosModel';
import { SliderComponentProps } from '../slider/slider.component';
import { InlineBlockPicker } from '../inline-block-picker/inline-block-picker.component';
import { EnvioHookasFiltradas } from './sub-comps/hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
import { BasicAlertcomponent } from '../../classes/BasicAlertComponent';
import {
  ActualItemTypes,
  HookaService,
} from './services/hooka-service.service';
export interface ComparadorHookasApi {
  protocol: string;
  host: string;
  port: number;
}
@Component({
  selector: 'lib-comparador-hookas',
  templateUrl: './comparador-hookas.component.html',
  styleUrls: ['./comparador-hookas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparadorHookasComponent
  extends BasicAlertcomponent
  implements OnInit {
  @Input() inputModel: ComparadorHookasInputModel;
  @Input() APIcomms: ComparadorHookasApi;
  public tradeMarksWithModelsSelectores: Array<ConfiguracionFiltrosAvanzadosMarcas> = [];
  public tagsChips: FiltrosAvanzadosChipPicker;
  public priceSlider: SliderComponentProps;
  public checks: Array<ChecksProps>;
  public mostrarSortBox: boolean = true;
  public ordenarPor: string = 'precio';
  public tipoOrdenacion: 'ASC' | 'DESC' = 'ASC';
  public MININUM_PRICE_HOOKA: number = 50;
  public sortBlockItem: Array<InlineBlockPicker> = [
    { id: '', texto: 'Precio', selected: false, iconoA: 'fa-sort-amount-asc' },
  ];

  public set peticionCargaHookasTerminada(valor: boolean) {
    this._peticionCargaHookasTerminada = valor;
  }
  public get peticionCargaHookasTerminada() {
    return this._peticionCargaHookasTerminada;
  }
  public providers: Array<ProviderModel> = [];

  private _peticionCargaHookasTerminada: boolean = false;

  constructor(
    private http: HttpClient,
    public hookaService: HookaService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.hookaService.changedTypeItemToLoad.subscribe((data) => {
      this.cargarHookasGenerales(data);
    });
  }

  public async chipSortingSelected(data: ClaveValorModel) {
    this.tipoOrdenacion = this.tipoOrdenacion == 'ASC' ? 'DESC' : 'ASC';
    this.sortBlockItem[0].iconoA =
      this.tipoOrdenacion == 'DESC'
        ? 'fa-sort-amount-desc'
        : 'fa-sort-amount-asc';
    this.hookaService.setFilterPropertyValue(
      'ordenarPrecio',
      this.tipoOrdenacion
    );
    let res: EnvioHookasFiltradas = await this.hookaService.realizarFiltro();
    this.cambioPaginaPaginador(res.confPaginador as any, res.resultadoFiltraje);
    this.changeDetectorRef.markForCheck();
  }

  public cambioPaginaPaginador(
    event: PageEvent,
    specificArray?: Array<HookasWithSiteMetadata>
  ) {
    this.hookaService.PAGINA_ACTUAL = event.pageIndex + 1;
    this.hookaService.MAX_POR_PAGINA = event.pageSize;
    let punteroMAximoArray =
      this.hookaService.PAGINA_ACTUAL * this.hookaService.MAX_POR_PAGINA;
    let punteroInicial = punteroMAximoArray - this.hookaService.MAX_POR_PAGINA;
    this.hookaService.cachimbas = cloneDeep(
      specificArray ? specificArray : this.hookaService.copiaCachimbas
    );
    this.hookaService.cachimbasSliced = (specificArray
      ? specificArray
      : this.hookaService.copiaCachimbas
    ).slice(punteroInicial, punteroMAximoArray);

    this.changeDetectorRef.markForCheck();
  }

  private cargarHookasGenerales(type: ActualItemTypes): void {
    this.peticionCargaHookasTerminada = false;
    let tipo = type ? type : this.hookaService.latestValueType;
    this.http
      .get(
        `${this.APIcomms.protocol}://${
          this.APIcomms.host + ':' + this.APIcomms.port
        }/blocks/latestBlock?filter=${encodeURIComponent(JSON.stringify({}))}`,
        { headers: { typeItem: tipo } }
      )
      .subscribe(
        (blockData: Block) => {
          this.peticionCargaHookasTerminada = true;
          let data = blockData.minedIds;
          this.providers = data.map((entry) => {
            return {
              nombre: entry.name,
              value: entry.id,
              image: entry.logo,
              numberItems: entry.data.length,
            };
          });
          let res = data.reduce((prev, current, index) => {
            prev.push(
              ...(current.data ? current.data : [])
                .map((entry: HookasWithSiteMetadata) => {
                  entry = this.eliminarImpurezas(entry);
                  entry.logoCompany = current.logo;
                  entry.nameCompany = current.name;
                  entry.idCompany = current.id;
                  entry.precioOriginal = Number(
                    (entry.precioOriginal as string).replace(/,/g, '.')
                  ) as any;
                  return entry;
                })
                .filter((filterEntry) => {
                  return !Number.isNaN(filterEntry.precioOriginal);
                })
            );
            return prev;
          }, []);
          this.hookaService.cachimbas = res;
          this.hookaService.cachimbasSliced = cloneDeep(
            this.hookaService.cachimbas
          );
          this.hookaService.copiaCachimbas = cloneDeep(
            this.hookaService.cachimbas
          );
          this.hookaService.cachimbasSliced.length = this.hookaService.MAX_POR_PAGINA;
          this.obtainMetadataFromHookas(this.hookaService.cachimbas);
          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          this.peticionCargaHookasTerminada = true;
          this.alertHappen.emit({
            title: 'Ha ocurrido un error',
            desc: error.message,
            type: 'error',
          });
          this.changeDetectorRef.markForCheck();
        }
      );
  }

  private eliminarImpurezas(entry: HookasWithSiteMetadata) {
    if (entry.marca && entry.modelo) {
      [entry.marca.toLowerCase(), '¡megapack!', '-'].forEach((regexValue) => {
        let re = new RegExp(regexValue, 'g');
        entry.modelo = entry.modelo.toLowerCase().replace(re, '').trim();
      });
      entry.modelo =
        entry.modelo.substr(0, 1).toUpperCase() +
        entry.modelo.substr(1, entry.modelo.length - 1);
    }
    return entry;
  }

  public obtainMetadataFromHookas(hookas: Array<HookasWithSiteMetadata>) {
    this.tradeMarksWithModelsSelectores = this.hookaService.obtainTradeMarkAndModel(
      hookas
    );
    this.tagsChips = this.hookaService.obtainTagsFromHookas(hookas);
    this.priceSlider = this.hookaService.obtainMininumAndMaxinumPrice(hookas);
    this.checks = this.hookaService.returnChecks(hookas);
  }
}
