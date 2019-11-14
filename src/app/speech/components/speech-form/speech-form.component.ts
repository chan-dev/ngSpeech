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
import { startWith, map, tap } from 'rxjs/operators';
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
  @Output() formChanges: EventEmitter<any> = new EventEmitter();
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  // NOTE: we don't need to store the value of this one, it's only
  // used for filtering
  tagCtrl = new FormControl();
  chipsConfig = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
    separatorKeysCodes: [ENTER, COMMA],
  };
  filteredTags: Observable<string[]>;
  // NOTE: value of chiplist
  selectedTags: string[] = [];
  // fetched from server
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

    this.speechForm.valueChanges
      .subscribe(value => this.formChanges.emit(this.speechForm));
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
        this.setTagsFormField(this.selectedTags);
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
      this.setTagsFormField(this.selectedTags);
    }
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    this.selectedTags.push(event.option.viewValue);
    this.setTagsFormField(this.selectedTags);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  saveOrUpdate() {
    const uniqueTags = [...new Set(this.selectedTags)];
    this.formSubmitted = true;
    this.setTagsFormField(uniqueTags);

    if (this.speechForm.valid) {
      this.formSubmit.emit(this.speechForm.value);
    }
  }

  private setTagsFormField(tags) {
    const tagControl = this.speechForm.get('tags');

    tagControl.setValue(tags);
    tagControl.markAsDirty();
  }

  private updateSpeechOnChanges(speechChanges) {
    if (
      speechChanges &&
      speechChanges.currentValue !== speechChanges.previousValue
    ) {
      if (this.speech) {
        const { title, content, dueDate } = this.speech;
        this.speechForm.patchValue({
          title,
          content,
          dueDate: new Date(dueDate)
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
        // We set the tags form field dirty status here since
        // We only update tags form field value on submit
        // tap(value =>  this.speechForm.get('tags').markAsDirty()),
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
