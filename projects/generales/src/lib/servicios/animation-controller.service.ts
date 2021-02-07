import { Injectable } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
@Injectable({
  providedIn: 'root',
})
export class AnimationControllerService {
  constructor() {}

  public ejecutarAnimacion(query: any, propiedadesAnimacion: any, customOnComplete?: Function, customOnBeging?: Function) {
    return new Promise((resolve, reject) => {
      try {
        let objAnimacion = Object.assign(
          {
            targets: query,
            duration: 1000,
            begin: (anim) => {
              if (customOnBeging) customOnBeging(anim);
            },
            complete: (anim) => {
              if (customOnComplete) customOnComplete(anim);
              resolve(anim);
            },
            easing: 'linear',
          },
          propiedadesAnimacion
        );
        anime(objAnimacion);
      } catch (error) {
        reject(error);
      }
    });
  }
}
