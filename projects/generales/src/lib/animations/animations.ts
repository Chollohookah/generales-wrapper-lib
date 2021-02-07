import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const Animations = {
  animeTrigger: trigger('animeTrigger', [
    state('in', style({ transform: 'translateY(0)' })),
    transition('void => *', [
      animate(
        700,
        keyframes([
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
        ])
      ),
    ]),
  ]),
  bubbleGrow: trigger('bubbleGrow', [
    transition(':enter', [
      animate(
        '250ms ease-in-out',
        keyframes([style({ transform: 'scale(0)' }), style({ transform: 'scale(1.1)' }), style({ transform: 'scale(1)' })])
      ),
    ]),
    transition(':leave', [
      animate(
        '250ms ease-in-out',
        keyframes([style({ transform: 'scale(1)' }), style({ transform: 'scale(1.1)' }), style({ transform: 'scale(0)' })])
      ),
    ]),
  ]),
  infiniteBubble: trigger('infiniteBubble', [
    state('inactive', style({ transform: 'scale(1.0)' })),
    state('active', style({ transform: 'scale(1.1)' })),
    transition('* <=> *', [animate(500)]),
  ]),
};
