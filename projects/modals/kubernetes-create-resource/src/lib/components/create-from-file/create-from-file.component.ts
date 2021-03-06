import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'amkubernetes-create-resource-create-from-file',
  templateUrl: './create-from-file.component.html',
  styleUrls: ['./create-from-file.component.scss']
})
export class CreateFromFileComponent implements OnInit {

  newObjectForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.newObjectForm = this.formBuilder.group({
      objectFile: [null, [Validators.required]]
    });
  }

}
