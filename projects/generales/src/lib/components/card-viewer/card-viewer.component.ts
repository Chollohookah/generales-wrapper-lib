import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HookasWithSiteMetadata } from '../comparador-hookas/interfaces/RelationSiteHooka';
import { PosibleActions } from '../lateral-actions/models/PosibleActions';
import { AnunciosHookas } from './models/AnunciosHookas';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { ImgAccordionComponent } from '../img-accordion/img-accordion.component';
import { DescriptionComponent } from '../description/description.component';
import { BasicAlertcomponent } from '../../classes/BasicAlertComponent';
@Component({
  selector: 'lib-card-viewer',
  templateUrl: './card-viewer.component.html',
  styleUrls: ['./card-viewer.component.scss'],
})
export class CardViewerComponent extends BasicAlertcomponent implements OnInit {
  @Input() set index(index: number) {
    this._index = index;
  }

  @Input() set item(item: HookasWithSiteMetadata) {
    this._item = item;
    this.detectarAnuncio(this._item);
  }

  public posiblesAccionesConCachimbas: Array<PosibleActions> = [
    {
      icon: 'info',
      color: 'secondary',
      tooltip: 'Más información',
      action: () => {
        this.dialog.open(DescriptionComponent, {
          data: this._item,
          autoFocus: false,
        });
      },
    },
    {
      icon: 'launch',
      tooltip: 'Abrir pagina',
      color: 'primary',
      action: () => {
        let tabWindowId = window.open('about:blank', '_blank');
        if (tabWindowId) {
          tabWindowId.location.href = this._item.linkProducto;
        }
      },
    },
    {
      icon: 'favorite',
      tooltip: 'Añadir a  favoritos',
      color: 'danger',
      action: () => {
        let cookiesKeys = Object.keys(this.cookieService.getAll());
        let resBusqueda = cookiesKeys.find((entry) => {
          if (entry.includes('savedHooka')) {
            if (
              this.cookieService.getAll()[entry] === this._item.linkProducto
            ) {
              return entry;
            }
          }
          return false;
        });
        if (resBusqueda) {
          this.alertHappen.emit({
            title: this._item.titulo + ' ya esta agregado en favoritos!',
            desc: 'No duplicamos cachimbas!',
            type: 'warning',
          });
        } else {
          this.alertHappen.emit({
            title: this._item.titulo + ' añadido a favoritos!',
            desc: 'Añadida',
            type: 'success',
          });
          this.cookieService.set(
            'savedHooka' + uuidv4(),
            this._item.linkProducto
          );
        }
      },
    },
  ];

  public _index: number = -1;
  public _item: HookasWithSiteMetadata = {
    logoCompany: '',
    nameCompany: '',
  } as HookasWithSiteMetadata;

  public anuncioHooka: AnunciosHookas = {
    texto: undefined,
    color: 'primary',
    textColor: 'primary',
  };

  public mostrandoOpciones: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cookieService: CookieService
  ) {
    super();
  }

  ngOnInit(): void {}

  public copiadoAlPortapeles(color: string): void {
    this.alertHappen.emit({
      title: `El color ${color} fue copiado al portapapeles`,
      desc: '',
      type: 'info',
    });
  }

  public hayAnuncio() {
    return this.anuncioHooka != null;
  }

  public detectarAnuncio(hooker: HookasWithSiteMetadata) {
    if (hooker.agotado) {
      this.anuncioHooka = {
        texto: 'AGOTADO',
        color: 'dark',
        textColor: 'light',
      };
    } else if (hooker.precioRebajado != null) {
      this.anuncioHooka = {
        texto: 'OFERTA',
        color: 'info',
        textColor: 'light',
      };
    } else if (hooker.cantidad != null) {
      this.anuncioHooka = {
        texto: 'ULTIMOS',
        color: 'warning',
        extraData: Number(hooker.cantidad),
        textColor: 'light',
      };
    }
  }

  public abrirModalImagenes(): void {
    let imgAccordion = this.dialog.open(ImgAccordionComponent, {
      data: this._item.fotos,
    });
  }
}
