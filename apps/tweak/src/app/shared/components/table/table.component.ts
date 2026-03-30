import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
  input,
  output,
  viewChild
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  IonSearchbar,
  IonCheckbox,
  IonThumbnail,
  IonImg,
} from '@ionic/angular/standalone';

export type ColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'link'
  | 'image';

export interface ColumnConfig {
  columnDef: string;
  header: string;
  type?: ColumnType;
}

export interface TableConfig<T> {
  columns: ColumnConfig[];
  data: T[];
  searchable?: boolean;
}

/**
 * @title Data table
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    IonSearchbar,
    IonCheckbox,
    IonThumbnail,
    IonImg,
  ],
})
export class TableComponent {
  readonly config = input.required<Signal<TableConfig<any>>>();
  readonly selected = output();

  readonly sort = viewChild.required(MatSort);

  public dataSource = computed(() => {
    const dataSource = new MatTableDataSource(this.config()().data);
    dataSource.filter = this.searchTerm();
    return dataSource;
  });

  public displayedColumns = computed(() => {
    return this.config()().columns.map((column) => column.columnDef);
  });

  private searchTerm: WritableSignal<string> = signal('');

  public onRowClick(row: any) {
    this.selected.emit(row);
  }

  public onInputChange(term: string | null | undefined) {
    typeof term === 'string'
      ? this.searchTerm.set(term.trim().toLowerCase())
      : this.searchTerm.set('');
  }

  constructor() {
    // Enable sorting
    effect(() => {
      this.dataSource().sort = this.sort();
    });
  }
}
