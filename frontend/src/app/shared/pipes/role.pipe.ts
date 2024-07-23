import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleDisplayed',
})
export class RolePipe implements PipeTransform {
  transform(value: string[]): string {
    return value.join(', ');
  }
}
