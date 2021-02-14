import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { cloneDeep } from 'lodash-es';
import { ClaveValorModel } from '../comparador-hookas/interfaces/FiltrosAvanzadosModel';
import { AllTagsViewerComponent, InlineBlockerPickerConfig } from '../comparador-hookas/sub-comps/all-tags-viewer/all-tags-viewer.component';
import { EnvioHookasFiltradas } from '../comparador-hookas/sub-comps/hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
export interface InlineBlockPicker {
  id: string;
  texto: string;
  selected: boolean;
  iconoA?: string;
  iconoD?: string;
  customClickEvent?: Function;
  customCss?: string;
}

interface ConstructorInput {
  maxItems: number;
  chipsInput: Array<InlineBlockPicker>;
}
@Component({
  selector: 'lib-inline-block-picker',
  templateUrl: './inline-block-picker.component.html',
  styleUrls: ['./inline-block-picker.component.scss'],
})
export class InlineBlockPickerComponent
  implements OnInit, InlineBlockerPickerConfig {
  @Input() maxItems: number = 10;
  @Input() maxPorPagina: number = 50;
  @Input() forceNoPaginator: boolean = false;
  @Input() MAX_POR_PAGINA_POSIBILIDADES = [this.maxPorPagina, 100, 150, 200];
  @Input('chipsInput') set chipsInput(data: Array<InlineBlockPicker>) {
    if (data) {
      if (data.length > this.maxPorPagina && !this.forceNoPaginator) {
        let punteroMaximo = (this.paginaActual + 1) * this.maxPorPagina;
        let punteroInicial = punteroMaximo - this.maxPorPagina;
        this._chipsInput = cloneDeep(data);
        this.sliced_chipsInput = data.slice(punteroInicial, punteroMaximo);
      } else {
        this.sliced_chipsInput = [];
        this._chipsInput = data;
      }
    }
  }

  @Output() chipSelection = new EventEmitter<ClaveValorModel>();
  @Output() onFilterApply = new EventEmitter<EnvioHookasFiltradas>();
  private paginaActual: number = 0;
  public sliced_chipsInput: Array<InlineBlockPicker> = [];
  public _chipsInput: Array<InlineBlockPicker> = [];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ConstructorInput
  ) {
    if (this.data && this.data.maxItems && this.data.chipsInput) {
      this.maxItems = this.data.maxItems;
      this.chipsInput = cloneDeep(this.data.chipsInput);
    }
  }

  ngOnInit(): void {}

  public emitirClick(objetoSeleccionado: InlineBlockPicker, ...args) {
    if (!objetoSeleccionado.selected) {
      objetoSeleccionado.selected = true;
    } else {
      objetoSeleccionado.selected = false;
    }
    this.chipSelection.emit({
      clave: 'etiquetasSeleccionadas',
      valor: this._chipsInput
        .filter((entry) => entry.selected)
        .map((entry) => entry.texto),
      data: objetoSeleccionado,
    });
  }

  public verTodas() {
    const dialogRef = this.dialog.open(AllTagsViewerComponent, {});
    dialogRef.componentInstance.allTagsViewerConfig = {
      maxItems: 99999999999,
      chipsInput: this._chipsInput,
      forceNoPaginator: false,
      MAX_POR_PAGINA_POSIBILIDADES: this.MAX_POR_PAGINA_POSIBILIDADES,
      maxPorPagina: this.maxPorPagina,
      chipSelection: this.chipSelection,
    };
    dialogRef.componentInstance.onFilterApply.subscribe((data) => {
      this.onFilterApply.emit(data);
      dialogRef.close();
    });

    dialogRef.beforeClosed().subscribe((data) => {
      this._chipsInput = this._chipsInput.sort((entryX, entryY) => {
        return Number(entryY.selected) - Number(entryX.selected);
      });
    });
  }

  public cambioPaginaPaginador(event: PageEvent) {
    this.paginaActual = event.pageIndex + 1;
    this.maxPorPagina = event.pageSize;
    let punteroMAximoArray = this.paginaActual * this.maxPorPagina;
    let punteroInicial = punteroMAximoArray - this.maxPorPagina;
    this.sliced_chipsInput = this._chipsInput.slice(
      punteroInicial,
      punteroMAximoArray
    );
  }

  public returnArrayListChips() {
    return this.sliced_chipsInput && this.sliced_chipsInput.length > 0
      ? this.sliced_chipsInput
      : this._chipsInput;
  }
}
