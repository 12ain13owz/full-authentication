import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(value: any, errorObj: Record<string, unknown>): unknown {
    return value[Object.keys(errorObj)[0]];
  }
}
