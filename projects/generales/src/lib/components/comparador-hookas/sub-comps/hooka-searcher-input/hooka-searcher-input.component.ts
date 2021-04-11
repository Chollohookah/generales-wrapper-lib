import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ComparadorHookasIconoConfig, ComparadorHookasInputModel } from '../../interfaces/ComparadorHooksInputModel';
import { HookaService } from '../../services/hooka-service.service';
import { BasicPaginatorChangeModel, EnvioHookasFiltradas } from './interfaces/BasicPaginatorChangeModel';

@Component({
  selector: 'lib-hooka-searcher-input',
  templateUrl: './hooka-searcher-input.component.html',
  styleUrls: ['./hooka-searcher-input.component.scss'],
})
export class HookaSearcherInputComponent implements OnInit {
  @Input() inputModel: ComparadorHookasInputModel;
  @Output() actualizarDesdeInput = new EventEmitter<EnvioHookasFiltradas>();
  @Output() showOrderBox = new EventEmitter<void>();
  @Output() cerrarFiltrosAvanzados = new EventEmitter<void>();
  @ViewChildren('inputBusqueda') inputBusqueda: QueryList<any>;

  public soloIconosConCondicionPositiva(arrayIconos: Array<ComparadorHookasIconoConfig>) {
    return arrayIconos.filter((entry) => entry.condition(this));
  }
  public set valorBusqueda(valor: string) {
    this._valorBusqueda = valor;
  }
  public get valorBusqueda() {
    return this._valorBusqueda;
  }
  private _valorBusqueda: string = '';
  public _self = this;

  constructor(private hookaService: HookaService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.escucharCambiosInput();
  }

  public clickInput() {
    this.cerrarFiltrosAvanzados.emit();
  }

  private escucharCambiosInput(): void {
    fromEvent(this.inputBusqueda.first.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(async (data: any) => {
        this.valorBusqueda = data.target.value;
        this.hookaService.setFilterPropertyValue('inputValue', data.target.value);
        let emision: EnvioHookasFiltradas = await this.hookaService.realizarFiltroNoWorker();
        this.actualizarDesdeInput.emit(emision);
      });
  }
}
