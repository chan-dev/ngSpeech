import {
  Component,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Tag, Speech } from '@app/models/api';

@Component({
  selector: 'app-speech-form',
  templateUrl: './speech-form.component.html',
  styleUrls: ['./speech-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpeechFormComponent implements OnChanges {
  @Input() editMode: boolean;
  @Input() submitLabel: string;
  @Input() speech: Speech;
  @Input() tags: Tag[];
  @Input() speechTags: Tag[];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  // NOTE: we don't need to store the value of this one, it's only
  // used for filtering
  fruitCtrl = new FormControl();
  tagCtrl = new FormControl();
  chipsConfig = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
    separatorKeysCodes: [ENTER, COMMA],
  };
  filteredFruits: Observable<string[]>;
  filteredTags: Observable<string[]>;
  // NOTE: value of chiplist
  selectedFruits: string[] = ['Lemon'];
  selectedTags: string[] = [];
  // fetched from server
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  allTags: string[];
  speechForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.speechForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''], // will be updated on submit
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateTagsOnChanges(changes.tags);
    this.updateSpeechOnChanges(changes.speech);
    this.updateSpeechTagsOnChanges(changes.speechTags);
    this.setFilteredTags();
  }

  addSelectedTag(event: MatChipInputEvent) {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
        this.selectedTags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  removeSelectedTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    this.selectedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  saveOrUpdate() {
    const uniqueTags = [...new Set(this.selectedTags)];
    this.formSubmitted = true;

    this.speechForm.get('tags').setValue(uniqueTags);

    if (this.speechForm.valid) {
      this.formSubmit.emit(this.speechForm.value);
    }
  }

  private updateSpeechOnChanges(speechChanges) {
    if (
      speechChanges &&
      speechChanges.currentValue !== speechChanges.previousValue
    ) {
      if (this.speech) {
        const { title, content, createdAt } = this.speech;
        this.speechForm.patchValue({
          title,
          content,
          dueDate: new Date(createdAt),
        });
      }
    }
  }

  private updateTagsOnChanges(tagsChanges) {
    if (tagsChanges && tagsChanges.currentValue !== tagsChanges.previousValue) {
      if (this.tags) {
        this.allTags = this.tags.map(tags => tags.text);
      }
    }
  }

  private updateSpeechTagsOnChanges(speechTagChanges) {
    if (speechTagChanges && speechTagChanges.currentValue !== speechTagChanges.previousValue) {
      if (this.speechTags) {
        const speechTags = this.speechTags.map(tag => tag.text);
        this.selectedTags = speechTags || [];
      }
    }
  }

  // Function that updates autocomplete dropdown based on user input
  private setFilteredTags() {
    if (this.tags && !this.filteredTags) {
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) =>
          tag ? this._filter(tag) : this.allTags.slice()
        )
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      tag => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }

  get controls() {
    return this.speechForm.controls;
  }

  get title() {
    return this.controls.title;
  }

  get content() {
    return this.controls.content;
  }

  get dueDate() {
    return this.controls.dueDate;
  }
}
