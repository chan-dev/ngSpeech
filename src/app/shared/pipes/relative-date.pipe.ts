import { Pipe, PipeTransform } from '@angular/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: string): any {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  }
}
