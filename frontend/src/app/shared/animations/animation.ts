import {
  AnimationTriggerMetadata,
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function FadeInOut(
  timingIn: number,
  timingOut: number,
  height: boolean = false
): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(timingIn, style({ opacity: 1 })),
    ]),
    transition(':leave', [animate(timingOut, style({ opacity: 0 }))]),
  ]);
}
