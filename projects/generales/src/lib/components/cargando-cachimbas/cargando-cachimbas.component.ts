import { Component, OnInit } from '@angular/core';
import { Animations } from '../../animations/animations';
import { AnimationControllerService } from '../../servicios/animation-controller.service';
@Component({
  selector: 'lib-cargando-cachimbas',
  templateUrl: './cargando-cachimbas.component.html',
  styleUrls: ['./cargando-cachimbas.component.scss'],
  animations: [Animations.infiniteBubble],
})
export class CargandoCachimbasComponent implements OnInit {
  public state = 'inactive';
  private times = 500;
  private counter = 0;
  constructor(private animationController: AnimationControllerService) { }

  ngOnInit(): void { }

  public onDoneAnim(event: any) {
    if (this.counter < this.times) {
      this.state = this.state === 'active' ? 'inactive' : 'active';
      this.counter++;
    }
  }
}
