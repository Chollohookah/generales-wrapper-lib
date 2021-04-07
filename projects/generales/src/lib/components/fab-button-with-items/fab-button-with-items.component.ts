import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
export interface FabButtonWithItems {
  icono: string;
  onClick: Function;
}
@Component({
  selector: 'lib-fab-button-with-items',
  templateUrl: './fab-button-with-items.component.html',
  styleUrls: ['./fab-button-with-items.component.scss'],
  animations: [
    trigger('fabToggler', [
      state(
        'inactive',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'active',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('* <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('speedDialStagger', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(
          ':enter',
          stagger('40ms', [
            animate(
              '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              keyframes([
                style({ opacity: 0, transform: 'translateY(10px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          { optional: true }
        ),

        query(
          ':leave',
          animate(
            '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
          ),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class FabButtonWithItemsComponent implements OnInit {
  @Input() fabButtons: Array<FabButtonWithItems> = [];
  @Input() displayingType: 'icon' | 'image' = 'icon';
  @Input() displayingResource: string = 'add';
  public buttons: Array<any> = [];
  public fabTogglerState: 'active' | 'inactive' = 'inactive';

  constructor() {}

  ngOnInit(): void {}

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }
}
