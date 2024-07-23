import {
  Component,
  input,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly IMAGE_URL = environment.IMAGE_URL;
  action = output<number>();

  displayedColumns = input<string[]>();
  dataInput = input<any[]>();

  dataSource: MatTableDataSource<any>;
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dataInput());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataInput']) return;

    this.dataSource = new MatTableDataSource(this.dataInput());
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  onAction(id: number) {
    this.action.emit(id);
  }
}
