import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, AbstractControl, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';
import {VaultState} from '@anyopsos/module-vault';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

interface InitializeResult {
  keys: string[]; keys_base64: string[]; root_token: string; successCreated: boolean; userUuid: string; password: string;
}

@Component({
  selector: 'albp-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit {
  @Input() readonly vaultState: VaultState;
  @Output() private stateChanged = new EventEmitter<void>();

  vaultResult: InitializeResult;

  initializeForm: FormGroup;
  unsealForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly http: HttpClient,
              private readonly logger: AnyOpsOSLibLoggerService) {

  }

  ngOnInit(): void {
    this.initializeForm = this.formBuilder.group({
      rootAccount: ['root', Validators.required],
    });
    this.unsealForm = this.formBuilder.group({
      unsealKey: ['', Validators.required],
    });
  }

  /**
   * Form getter
   */
  get getInitializeForm(): { [key: string]: AbstractControl } { return this.initializeForm.controls; }
  get getUnsealForm(): { [key: string]: AbstractControl } { return this.initializeForm.controls; }

  /**
   * User actions
   */
  initializeVault(): void {

    this.http.post('/api/vault/initialize', {
      username: this.getInitializeForm.rootAccount.value
    }).subscribe(
      (res: BackendResponse & { data: InitializeResult }) => {
        if (res.status === 'error') this.logger.error('anyOpsOS', 'initializeVault -> Error while initializing the Vault', null, res.data);

        if (res.status === 'ok') this.vaultResult = res.data;
      },
      (error: BackendResponse) => {
        this.logger.error('anyOpsOS', 'initializeVault -> Error while initializing the Vault', null, error);
      });
  }

  unsealVault(): void {

    this.http.post('/api/vault/unseal', {
      key: this.getUnsealForm.unsealKey.value
    }).subscribe(
      (res: BackendResponse & { data: InitializeResult }) => {
        if (res.status === 'error') this.logger.error('anyOpsOS', 'unsealVault -> Error while initializing the Vault', null, res.data);

        // This will recheck the Vault state
        if (res.status === 'ok') this.markStateChanged();
      },
      (error: BackendResponse) => {
        this.logger.error('anyOpsOS', 'unsealVault -> Error while initializing the Vault', null, error);
      });
  }

  createRootAccount(): void {

  }

  markStateChanged(): void {
    this.stateChanged.emit();
  }

}
