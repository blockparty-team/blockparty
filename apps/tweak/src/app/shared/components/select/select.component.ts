import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  WritableSignal,
  computed,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonContent,
  IonRadioGroup,
  IonRadio,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  IonButton,
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonChip,
  IonSearchbar,
} from '@ionic/angular/standalone';

export interface ListSelectionConfig {
  entity: string;
  displayProperty: string;
  multiSelect: boolean;
  searchable: boolean;
  breakpoints: number[];
  initialBreakpoint: number;
}

const defaultCongig: ListSelectionConfig = {
  entity: '',
  displayProperty: 'name',
  multiSelect: false,
  searchable: false,
  breakpoints: [0, 0.5, 1],
  initialBreakpoint: 0.5,
};

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
    imports: [
        IonContent,
        IonToolbar,
        IonRadioGroup,
        IonRadio,
        IonHeader,
        IonSearchbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonCheckbox,
        IonList,
        IonItem,
        IonLabel,
        IonModal,
        IonChip,
    ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() public items: WritableSignal<any[]> = signal([]);
  @Input() public config: WritableSignal<ListSelectionConfig> =
    signal(defaultCongig);
  @Output() selected = new EventEmitter<any[]>();

  private searchTerm: WritableSignal<string | null> = signal(null);

  selectedItems: WritableSignal<any[]> = signal([]);

  public filteredItems = computed(() => {
    const items = this.items();
    const searchTerm = this.searchTerm();

    if (!searchTerm || searchTerm.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const displayName = this.displayName(item);
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(items: any[]): void {
    !!items ? this.selectedItems.set(items) : this.selectedItems.set([]);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  displayName(item: any): string {
    return item[this.config().displayProperty];
  }

  isSelected(item: any) {
    return this.selectedItems().some((s) => s.id === item.id);
  }

  compareWith(o1: any, o2: any) {
    return o1.id === o2.id;
  }

  onSelectItem(item: any) {
    this.selectedItems.update((items) => {
      if (!this.config().multiSelect) {
        return [item];
      }

      return items.some((i) => i.id === item.id)
        ? items.filter((i) => i.id !== item.id)
        : [...items, item];
    });

    this.selected.emit(this.selectedItems());

    if (this.onChange) {
      this.onChange(this.selectedItems());
    }
  }

  onDeleteItem(id: string) {
    this.selectedItems.update((items) => items.filter((i) => i.id !== id));
    this.selected.emit(this.selectedItems());

    if (this.onChange) {
      this.onChange(this.selectedItems());
    }
  }

  onInputChange(term: string | null | undefined) {
    this.onTouched();
    typeof term === 'string'
      ? this.searchTerm.set(term)
      : this.searchTerm.set(null);
  }
}
