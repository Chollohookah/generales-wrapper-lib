import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { InlineBlockPicker } from '../../../inline-block-picker/inline-block-picker.component';
import { ClaveValorModel } from '../../interfaces/FiltrosAvanzadosModel';
import { HookaService } from '../../services/hooka-service.service';
import { EnvioHookasFiltradas } from '../hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
export interface InlineBlockerPickerConfig {
  maxItems: number;
  maxPorPagina: number;
  MAX_POR_PAGINA_POSIBILIDADES: Array<number>;
  chipsInput: Array<InlineBlockPicker>;
  forceNoPaginator: boolean;
  chipSelection: EventEmitter<ClaveValorModel>;
}
@Component({
  selector: 'lib-all-tags-viewer',
  templateUrl: './all-tags-viewer.component.html',
  styleUrls: ['./all-tags-viewer.component.scss'],
})
export class AllTagsViewerComponent implements OnInit {
  @Input('allTagsViewerConfig') set allTagsViewerConfig(data: InlineBlockerPickerConfig) {
    if (data) {
      this._allTagsViewerConfig = data;
      this.copiaChips = cloneDeep(this._allTagsViewerConfig.chipsInput);
    }
  }
  @Output() onFilterApply = new EventEmitter<EnvioHookasFiltradas>();

  public _allTagsViewerConfig: InlineBlockerPickerConfig;
  public copiaChips: Array<InlineBlockPicker> = [];
  public selectedChips: Array<InlineBlockPicker> = [];
  constructor(private hookaService: HookaService) {}

  ngOnInit(): void {}

  public filtroCambiado(event: Event) {
    this._allTagsViewerConfig.chipsInput = this.copiaChips.filter((entry) =>
      entry.texto.toLowerCase().includes(event.target['value'].toLowerCase())
    );
  }

  public chipSeleciconado(chip: ClaveValorModel) {
    let selectedItem: InlineBlockPicker = chip.data;
    this.copiaChips.find((entry) => entry.id == selectedItem.id).selected = selectedItem.selected;
    this.selectedChips = this.copiaChips.filter((entry) => entry.selected);
  }

  public async aplicar() {
    this.hookaService.setFilterPropertyValue(
      'etiquetasSeleccionadas',
      this.copiaChips.filter((entry) => entry.selected).map((entry) => entry.texto.toLowerCase())
    );
    let emision: EnvioHookasFiltradas = await this.hookaService.realizarFiltroNoWorker();
    this.onFilterApply.emit(emision);
  }
}
