import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hooka } from '../comparador-hookas/interfaces/ModeloHookasBack';
import { HookasWithSiteMetadata } from '../comparador-hookas/interfaces/RelationSiteHooka';

@Component({
  selector: 'lib-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  @Input() hooka: HookasWithSiteMetadata;
  public keys = Object.keys;

  constructor(@Inject(MAT_DIALOG_DATA) public data: HookasWithSiteMetadata) {
    if (this.data) {
      this.hooka = this.data;
    }
  }

  ngOnInit(): void {}

  public toUpperCaseFirst(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1).toLowerCase();
  }

  public getIconByKey(str: string) {
    switch (str.toLowerCase()) {
      case 'tamanyo':
        return 'close_fullscreen';
      case 'altura':
        return 'north';
      case 'material':
        return 'touch_app';
      case 'cazoleta':
        return 'inbox';
      case 'color':
        return 'palette';
      case 'incluyeBase':
        return 'foundation';
      case 'incluyeManguera':
        return 'science';
      case 'tipo':
        return '3d_rotation';
      case 'procedencia':
        return 'tour';
      default:
        return '';
    }
  }

  public goLink() {
    let tabWindowId = window.open('about:blank', '_blank');
    tabWindowId.location.href = this.hooka.linkProducto;
  }
}
