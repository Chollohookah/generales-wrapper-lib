import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { Options, ChangeContext } from '@angular-slider/ngx-slider';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HookaService } from '../comparador-hookas/services/hooka-service.service';
import { EnvioHookasFiltradas } from '../comparador-hookas/sub-comps/hooka-searcher-input/interfaces/BasicPaginatorChangeModel';
import { isPlatformBrowser } from '@angular/common';
export interface SliderComponentProps {
  value: number;
  highValue: number;
  options: Options;
  manualRefresh?: Function;
  triggerFocus?: Function;
  userChangeStart?: Function;
  userChange?: Function;
  userChangeEnd?: Function;
  valueChange?: Function;
  highValueChange?: Function;
}
@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements OnInit {
  @Input() set config(config: SliderComponentProps) {
    if (config) {
      this._config = config;
    }
  }
  @Output() onSliderChange = new EventEmitter<EnvioHookasFiltradas>();
  private onUserChangeObservable: Subject<ChangeContext> = new Subject();
  public _config: SliderComponentProps;
  public isBrowser: boolean;

  constructor(
    private hookaService: HookaService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.onUserChangeObservable
      .asObservable()
      .pipe(debounceTime(200))
      .subscribe(async (event) => {
        this.hookaService.setFilterPropertyValue('precioMin', event.value);
        this.hookaService.setFilterPropertyValue('precioMax', event.highValue);
        let emision: EnvioHookasFiltradas = await this.hookaService.realizarFiltroNoWorker();
        this.onSliderChange.emit(emision);
      });
  }

  public onValueChange(event) {}

  public async onUserChange(event: ChangeContext) {
    this.onUserChangeObservable.next(event);
  }
}
