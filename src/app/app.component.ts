import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'generales-wrapper';
  public headerItems = [
    {
      text: 'Cachimbas',
      assetName: 'cachimba.png',
      linkPath: 'cachimba',
    },
    {
      text: 'Accesorios',
      assetName: 'accesorios.png',
      linkPath: 'accesorio',
    },
    {
      text: 'Carbón',
      assetName: 'carbon.png',
      linkPath: 'carbon',
    },
    {
      text: 'Cazoleta',
      assetName: 'cazoletas.svg',
      linkPath: 'cazoleta',
    },
    {
      text: 'Esencias',
      assetName: 'esencias.png',
      linkPath: 'esencias',
    },
    {
      text: 'Manguera',
      assetName: 'manguera.png',
      linkPath: 'manguera',
    },
    {
      text: 'Melazas',
      assetName: 'melazas.png',
      linkPath: 'melaza',
    },
    {
      text: 'Sabores',
      assetName: 'sabores.png',
      linkPath: 'sabor',
    },
  ];
}
