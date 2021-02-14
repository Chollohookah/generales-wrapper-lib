import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { cloneDeep } from 'lodash-es';
import { InitialConfigInputMaterial, ClaveValorModel, ClaveValorBandera } from '../comparador-hookas/interfaces/FiltrosAvanzadosModel';
import { KeyValue } from '@angular/common';
import { HookaService } from '../comparador-hookas/services/hooka-service.service';

@Component({
  selector: 'lib-selector-con-buscador',
  templateUrl: './selector-con-buscador.component.html',
  styleUrls: ['./selector-con-buscador.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectorConBuscadorComponent implements OnInit {
  @Input('initialConfig') set initialConfig(inicialConfig: InitialConfigInputMaterial) {
    if (inicialConfig) {
      this.initialConfigObj = inicialConfig;
      if (this.initialConfigObj.disabled) {
        this.formularioBusqueda.get('itemSeleccionado').disable();
      } else {
        this.formularioBusqueda.get('itemSeleccionado').enable();
      }
    }
  }

  @Input('entradaSelector') set entradaSelector(arrayDatos: Array<ClaveValorBandera>) {
    if (arrayDatos && arrayDatos instanceof Array && arrayDatos.length > 0) {
      arrayDatos = this.deleteDuplicated(arrayDatos);
     // if (arrayDatos.length == 1) this.formularioBusqueda.get('itemSeleccionado').patchValue(arrayDatos[0].valor);
      this.arrayDatos = cloneDeep(arrayDatos);
      this.arrayDatosClone = cloneDeep(this.arrayDatos);
      this.yesData();
    } else {
      this.noData();
    }
  }

  public initialConfigObj: InitialConfigInputMaterial;
  public arrayDatos: Array<ClaveValorModel> = [];
  private arrayDatosClone: Array<ClaveValorModel> = [];
  public latestStatus: 'hadData' | 'didntHave' = null;
  @Output('selectedValueChanged') selectedValueChanged = new EventEmitter<any>();

  public formularioBusqueda: FormGroup;

  constructor(private fb: FormBuilder, private hookaService: HookaService) {
    /*this.hookaService.filterValuesChanged.subscribe((data) => {
      this.formularioBusqueda.patchValue({ itemSeleccionado: this.initialConfigObj ? data[this.initialConfigObj.idKey] : '' });
    });*/
    this.formularioBusqueda = this.fb.group({
      busqueda: ['', []],
      itemSeleccionado: [null, []],
    });
    this.noData();
    this.listenFormKeysWithCallbacksOnTrigger('busqueda', (valor: string) => {
      if (valor) {
        this.arrayDatos = cloneDeep(this.arrayDatosClone.filter((entry) => entry.clave.toLowerCase().includes(valor.toLowerCase())));
      } else {
        this.arrayDatos = cloneDeep(this.arrayDatosClone);
      }
    });
    this.listenFormKeysWithCallbacksOnTrigger('itemSeleccionado', (valor: string) => {
      this.selectedValueChanged.emit({
        clave: this.initialConfigObj ? this.initialConfigObj.idKey : '',
        valor,
      } as ClaveValorModel);
    });
  }

  ngOnInit(): void {}

  private deleteDuplicated(arrayData: Array<ClaveValorModel>) {
    return arrayData.filter((entry, index, self) => {
      return (
        index ===
        self.findIndex((t) => {
          return t.valor === entry.valor && t.clave === entry.clave;
        })
      );
    });
  }

  public removeSelection() {
    this.formularioBusqueda.reset();
  }

  private listenFormKeysWithCallbacksOnTrigger(keyName: string, callback: Function) {
    this.formularioBusqueda.get(keyName).valueChanges.subscribe((data) => {
      callback(data);
    });
  }

  private yesData(): void {
    if (this.latestStatus == 'hadData') return;
    this.formularioBusqueda.get('itemSeleccionado').enable();
    this.formularioBusqueda.get('busqueda').enable();
    this.latestStatus = 'hadData';
  }

  private noData(): void {
    if (this.latestStatus == 'didntHave') return;
    this.formularioBusqueda.get('itemSeleccionado').reset();
    this.formularioBusqueda.get('itemSeleccionado').disable();
    this.formularioBusqueda.get('busqueda').disable();
    this.latestStatus = 'didntHave';
  }
}
