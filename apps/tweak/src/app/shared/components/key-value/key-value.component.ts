import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
  forwardRef,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ItemReorderEventDetail,
  IonContent,
  IonReorder,
  IonReorderGroup,
  IonChip,
  IonLabel,
  IonFooter,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
} from '@ionic/angular/standalone';
import { map } from 'rxjs';

type Properties = {
  [key: string]: string;
};

export type KeyValueConfig = {
  buttonName: string;
  property1Key: string;
  property1Label: string;
  property2Key: string;
  property2Label: string;
};

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyValueComponent),
      multi: true,
    },
  ],
  imports: [
    NgFor,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonIcon,
    IonFabButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonLabel,
    IonFooter,
    IonList,
    IonItem,
    IonChip,
    IonReorderGroup,
    IonReorder,
    JsonPipe,
    AsyncPipe,
  ],
})
export class KeyValueComponent implements ControlValueAccessor {
  @Input() public config!: WritableSignal<KeyValueConfig>;

  private fb = inject(FormBuilder);

  keyValueForm = this.fb.group({
    items: this.fb.array<Properties>([]),
  });

  public chips = toSignal(
    this.keyValueForm.valueChanges.pipe(
      map((form) =>
        form.items
          ?.filter((item) => this.isFilled(item))
          .map((item) => item![this.config().property1Key])
      )
    )
  );

  get items() {
    return this.keyValueForm.get('items') as FormArray;
  }

  constructor() {
    this.keyValueForm.valueChanges.subscribe((form) => {
      // console.log('OI', this.items.value)
      if (!!form.items && form.items.some((item) => this.isFilled(item))) {
        this.onChange(form.items.filter((item) => this.isFilled(item)));
        this.onTouched();
      }
    });
  }

  onAddKeyValueGroup() {
    this.items.push(
      this.fb.group<Properties>({
        [this.config().property1Key]: '',
        [this.config().property2Key]: '',
      })
    );
  }

  async onRemoveKeyValueGroup(index: number) {
    this.items.removeAt(index);
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(items: Properties[]): void {
    // Reset the form to prevent adding to the existing items
    this.keyValueForm.reset();

    if (items) {
      items.forEach((item) => {
        this.items.push(
          this.fb.group<Properties>({
            [this.config().property1Key]: item[this.config().property1Key],
            [this.config().property2Key]: item[this.config().property2Key],
          })
        );
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const fromIndex = ev.detail.from;
    const toIndex = ev.detail.to;

    // Get the item that needs to be moved
    const item = this.items.at(fromIndex);

    // Remove the item from its current position
    this.items.removeAt(fromIndex);

    // Insert the item at the new position
    this.items.insert(toIndex, item);

    // Finish the reorder and position the item in the DOM
    ev.detail.complete();
  }

  isFilled(item: Properties | null) {
    return (
      !!item &&
      (!!item[this.config().property1Key] || !!item[this.config().property2Key])
    );
  }
}
