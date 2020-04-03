import chalk from 'chalk';
import fs from 'fs-extra';
import replaceInFile from 'replace-in-file';
import editJsonFile from 'edit-json-file';

// TODO ESM
const {blue, blueBright, red} = chalk;
const {copy, ensureDir, move, outputFile, outputJson, pathExistsSync, unlink} = fs;

import {runInDocker} from '../utils';
import {MAIN_PATH_CWD} from '../constants';
import {Types} from '../types/types';

export class Generators {

  private packageType!: string;
  private packageLongType!: string;
  private packagePrefix!: string;
  private projectPath!: string;

  constructor() {
  }

  private async yarnInstall(argv: { type: Types; name: string; prefix: string; }) {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Running 'yarn install' on workspace @anyopsos/${this.packageType}-${argv.name}\n`));

    await runInDocker(`yarn workspace @anyopsos/${this.packageType}-${argv.name} install`);
  };

  /**
   * Creates main angular module (library)
   */
  private async createLibrary(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blue(`[anyOpsOS Cli.] Generating module ${argv.name} of type ${this.packageType}`));
    console.log(red(`[anyOpsOS Cli.] Do not cancel this command...\n`));

    if (this.packageType === 'api' || this.packageType === 'module' || this.packageType === 'websocket') {

      await ensureDir(`${this.projectPath}/src`);
      await outputJson(`${this.projectPath}/tsconfig.json`, {
        extends: '../../../tsconfig.backend.json',
        compilerOptions: {
          outDir: `../../../.dist/${this.packageLongType}/${argv.name}`,
          baseUrl: '.',
          paths: {
            '*': [
              'node_modules/*',
              'src/types/*'
            ]
          }
        },
        include: [
          'src/**/*'
        ]
      }, {spaces: 2});

    } else {

      // Frontend module type
      await runInDocker(`ng generate library any-ops-o-s-${this.packageType}-${argv.name} --prefix ${this.packagePrefix}${argv.prefix} --entry-file public-api`);
    }

  };

  /**
   * Renames and moves the created project to its final location
   */
  private async moveLibraryToFinalLocation(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Moving module ${argv.name} to its final location\n`));

    await move(
      `${process.cwd()}/projects/any-ops-o-s-${this.packageType}-${argv.name}`,
      `${this.projectPath}`
    );
  };

  /**
   * Sets correct parameters/paths on files like (tsconfig, tslint, package, ng-package, angular).json
   */
  private async standarizeLibraryFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Editing project files to include module ${argv.name}.\n`));

    const packageFile = editJsonFile(`${this.projectPath}/package.json`);
    const ngPackageFile = editJsonFile(`${this.projectPath}/ng-package.json`);
    const tsConfigLibFile = editJsonFile(`${this.projectPath}/tsconfig.lib.json`);
    const tsConfigSpecFile = editJsonFile(`${this.projectPath}/tsconfig.spec.json`);
    const tsLintFile = editJsonFile(`${this.projectPath}/tslint.json`);
    const modulesTsConfigFile = editJsonFile(`${process.cwd()}/projects/tsconfig.json`);
    const mainTsConfigFile = editJsonFile(`${process.cwd()}/tsconfig.json`);
    const mainAngularFile = editJsonFile(`${process.cwd()}/angular.json`);

    packageFile.set('name', `@anyopsos/${this.packageType}-${argv.name}`);
    packageFile.set('homepage', 'https://github.com/anyOpsOS/anyOpsOS#readme');
    packageFile.set('repository.type', 'git');
    packageFile.set('repository.url', 'https://github.com/anyOpsOS/anyOpsOS.git');
    packageFile.set('bugs', 'https://github.com/anyOpsOS/anyOpsOS/issues');
    packageFile.set('keywords', []);
    packageFile.set('description', `anyOpsOS ${argv.name} ${argv.type}`);
    packageFile.set('author', 'Isart Navarro <contact@isartnavarro.io> (https://isartnavarro.io)');
    packageFile.set('license', 'GPL-3.0-or-later');
    packageFile.set('private', true);
    await packageFile.save();

    ngPackageFile.set('dest', `../../../.dist/${this.packageLongType}/${argv.name}`);
    ngPackageFile.set('$schema', '../../../node_modules/ng-packagr/ng-package.schema.json');
    await ngPackageFile.save();

    tsConfigLibFile.set('extends', '../../tsconfig.json');
    tsConfigLibFile.set('compilerOptions.outDir', '../../../out-tsc/lib');
    await tsConfigLibFile.save();

    tsConfigSpecFile.set('extends', '../../../tsconfig.json');
    tsConfigSpecFile.set('compilerOptions.outDir', '../../../out-tsc/spec');
    await tsConfigSpecFile.save();

    tsLintFile.set('extends', '../../../tslint.json');
    await tsLintFile.save();

    modulesTsConfigFile.set(`compilerOptions.paths.@anyopsos/${this.packageType}-${argv.name}`, [`.dist/${this.packageLongType}/${argv.name}`]);
    modulesTsConfigFile.set(`compilerOptions.paths.@anyopsos/${this.packageType}-${argv.name}/*`, [`.dist/${this.packageLongType}/${argv.name}/*`]);
    await modulesTsConfigFile.save();

    mainTsConfigFile.unset(`compilerOptions.paths.any-ops-o-s-${this.packageType}-${argv.name}`);
    mainTsConfigFile.unset(`compilerOptions.paths.any-ops-o-s-${this.packageType}-${argv.name}/*`);
    mainTsConfigFile.set(`compilerOptions.paths.@anyopsos/${this.packageType}-${argv.name}`, [`projects/${this.packageLongType}/${argv.name}/src/public-api`]);
    mainTsConfigFile.set(`compilerOptions.paths.@anyopsos/${this.packageType}-${argv.name}/*`, [`projects/${this.packageLongType}/${argv.name}/*`]);
    await mainTsConfigFile.save();

    let currentAngularProject = mainAngularFile.get(`projects.any-ops-o-s-${this.packageType}-${argv.name}`);
    currentAngularProject = JSON.parse(JSON.stringify(currentAngularProject).replace(/projects\/any-ops-o-s-(lib|ext-lib|modal|app)-[a-z-]*/gi, `projects/${this.packageLongType}/${argv.name}`));
    currentAngularProject.schematics = {
      '@schematics/angular:component': {
        style: 'scss'
      }
    };

    mainAngularFile.unset(`projects.any-ops-o-s-${this.packageType}-${argv.name}`);
    mainAngularFile.set(`projects.anyopsos-${this.packageType}-${argv.name}`, currentAngularProject);
    await mainAngularFile.save();
  };

  /**
   * Delete unwanted default files created by ng generate
   */
  private async deleteDefaultFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Deleting some angular default generated files.\n`));

    await unlink(`${this.projectPath}/src/lib/any-ops-o-s-${this.packageType}-${argv.name}.component.spec.ts`, (e) => { if (e) throw e; });
    await unlink(`${this.projectPath}/src/lib/any-ops-o-s-${this.packageType}-${argv.name}.component.ts`, (e) => { if (e) throw e; });
    await unlink(`${this.projectPath}/src/lib/any-ops-o-s-${this.packageType}-${argv.name}.service.spec.ts`, (e) => { if (e) throw e; });
    await unlink(`${this.projectPath}/src/lib/any-ops-o-s-${this.packageType}-${argv.name}.service.ts`, (e) => { if (e) throw e; });
  };

  /**
   * Sets correct name to library Module file
   */
  private async renameLibraryModuleFile(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Renaming module.\n`));

    await move(
      `${this.projectPath}/src/lib/any-ops-o-s-${this.packageType}-${argv.name}.module.ts`,
      `${this.projectPath}/src/lib/anyopsos-${this.packageType}-${argv.name}.module.ts`
    );
  };

  private async removeUnwantedCodeFromFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Removing unwanted code from module files.\n`));

    // Remove unwanted exports from public-api
    await replaceInFile({
      files: `${this.projectPath}/src/public-api.ts`,
      from: [/.*\.(service|component)';*\n/gi, /any-ops-o-s-/gi],
      to: ['', 'anyopsos-'],
    });

    // Remove unwanted imports/exports and declarations from module
    await replaceInFile({
      files: `${this.projectPath}/src/lib/anyopsos-${this.packageType}-${argv.name}.module.ts`,
      from: [/.*'\.\/any-ops-o-s-.*\n/gi, /\[[a-zA-Z]*]/gi, /\n\n\n\n/g],
      to: ['', '[]', '\n\n'],
    });
  };

  private async copyLicenseFile(): Promise<void> {
    console.log(blue(`[anyOpsOS Cli.] Copying LICENSE file.\n`));

    await copy(`${process.cwd()}/LICENSE`, `${this.projectPath}/LICENSE`, (e) => { if (e) throw e; });
  };

  private async createReadMe(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blue(`[anyOpsOS Cli.] Creating empty README.\n`));

    await outputFile(`${this.projectPath}/README.md`, `${this.packageType} ${argv.name}`);
  };

  /**
   * ----------
   */

  /**
   * Create base application type files
   */
  private async createBaseApplicationFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating Application base components.\n`));

    await runInDocker(`ng generate component components/body --project anyopsos-${this.packageType}-${argv.name}`);
    await runInDocker(`ng generate component components/status --project anyopsos-${this.packageType}-${argv.name}`);
    await runInDocker(`ng generate component components/actions --project anyopsos-${this.packageType}-${argv.name}`);
    await runInDocker(`ng generate component components/menu --project anyopsos-${this.packageType}-${argv.name}`);
  };

  /**
   * Create base modal type files
   */
  private async createBaseModalFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating Modal base components.\n`));

    await runInDocker(`ng generate component entry --project anyopsos-${this.packageType}-${argv.name}`);
    await runInDocker(`ng generate component anyopsos-${this.packageType}-${argv.name} --flat --project anyopsos-${this.packageType}-${argv.name}`);

    // Set package.json dependencies
    const packageFile = editJsonFile(`${this.projectPath}/package.json`);
    packageFile.set('dependencies', {
      '@anyopsos/lib-angular-material': '~0.0.1',
      '@anyopsos/lib-modal': '~0.0.1'
    });
    await packageFile.save();

    // Whitelist dependencies
    const ngPackageFile = editJsonFile(`${this.projectPath}/ng-package.json`);
    ngPackageFile.set('whitelistedNonPeerDependencies', [
      '@anyopsos/lib-angular-material',
      '@anyopsos/lib-modal'
    ]);
    await ngPackageFile.save();

    let dynamicModule = argv.name
      .toLowerCase()
      .replace(/-(.)/g, (match: any, group1: string) => group1.toUpperCase());

    dynamicModule = `${dynamicModule.charAt(0).toUpperCase()}${dynamicModule.slice(1)}`;

    const fulldynamicComponent = `AnyOpsOSModal${dynamicModule}Component`;
    const fulldynamicModule = `AnyOpsOSModal${dynamicModule}Module`;

    // Rewrite module file
    await outputFile(`${this.projectPath}/src/lib/anyopsos-modal-${argv.name}.module.ts`, `import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibModalModule, AnyOpsOSLibModalRegisteredStateService} from '@anyopsos/lib-modal';

import {EntryComponent} from './entry/entry.component';
import {${fulldynamicComponent}} from './anyopsos-modal-${argv.name}.component';

@NgModule({
  declarations: [
    ${fulldynamicComponent},
    EntryComponent
  ],
  imports: [
    CommonModule,
    // Shared module import
    AnyOpsOSLibAngularMaterialModule,
    AnyOpsOSLibModalModule
  ],
  exports: [],
  providers: [],
  entryComponents: [
    ${fulldynamicComponent}
  ]
})
export class ${fulldynamicModule} {

  constructor(private readonly ModalRegisteredState: AnyOpsOSLibModalRegisteredStateService) {

    ModalRegisteredState.putModal({
      uuid: '${argv.name}',
      size: 'sm'
    });

  }

}
`);

    // Delete unwanted entry files
    await unlink(`${this.projectPath}/src/lib/entry/entry.component.html`);
    await unlink(`${this.projectPath}/src/lib/entry/entry.component.scss`);

    // Rewrite entry file
    await outputFile(`${this.projectPath}/src/lib/entry/entry.component.ts`, `import {Component, Input, OnInit, Output} from '@angular/core';

import {MatDialog, MatDialogConfig, MatDialogRef} from '@anyopsos/lib-angular-material';

import {${fulldynamicComponent}} from '../anyopsos-modal-${argv.name}.component';

/**
 * This file is called by @anyopsos/lib-modal and is used to open a Modal.
 * You should NOT edit any of this content.
 */
@Component({
  template: ''
})
export class EntryComponent implements OnInit {
  @Input() private readonly dialogConfig: MatDialogConfig;
  @Output() private dialogRef: MatDialogRef<any>;

  constructor(private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dialogRef = this.dialog.open(${fulldynamicComponent}, this.dialogConfig);
  }
}
`);

    // Rewrite modal file
    await outputFile(`${this.projectPath}/src/lib/anyopsos-modal-${argv.name}.component.ts`, `import {Component, Inject, OnInit, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@anyopsos/lib-angular-material';
import {BodyComponent, ModalData} from '@anyopsos/lib-modal';

@Component({
  selector: 'am${argv.prefix}-anyopsos-modal-${argv.name}',
  templateUrl: './anyopsos-modal-${argv.name}.component.html',
  styleUrls: ['./anyopsos-modal-${argv.name}.component.scss']
})
export class ${fulldynamicComponent} implements OnInit {
  @ViewChild('modalBody', {static: true}) modalBody: BodyComponent;

  constructor(public readonly dialogRef: MatDialogRef<${fulldynamicComponent}>,
              @Inject(MAT_DIALOG_DATA) public readonly data: ModalData) {
  }

  ngOnInit(): void {

    // Do not delete this
    this.modalBody.dialogRef = this.dialogRef;
    this.modalBody.title = this.data.title;
    this.modalBody.type = this.data.type;
  }

}
`);

    // Rewrite modal html file
    await outputFile(`${this.projectPath}/src/lib/anyopsos-modal-${argv.name}.component.html`, `<almodal-body #modalBody>

  <!-- Put modal content here -->
  <span>Hello from ${argv.name} Modal!</span>

</almodal-body>

<!-- Put footer buttons here -->
<almodal-buttons>
  <button class="btn" type="button" (click)="dialogRef.close()" mat-flat-button>Close</button>
</almodal-buttons>
`);
  };

  /**
   * Create base library/external-library type files
   */
  private async createBaseLibFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating Library base components.\n`));

    await runInDocker(`ng generate service services/anyopsos-${this.packageType}-${argv.name} --project anyopsos-${this.packageType}-${argv.name}`);
  };

  /**
   * Create base api type files
   */
  private async createBaseApiFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating API base components.\n`));

    let dynamicModule = argv.name
      .toLowerCase()
      .replace(/-(.)/g, (match: any, group1: string) => group1.toUpperCase());

    dynamicModule = `${dynamicModule.charAt(0).toUpperCase()}${dynamicModule.slice(1)}`;

    const fulldynamicModule = `AnyOpsOS${dynamicModule}ApiController`;

    await outputJson(`${this.projectPath}/package.json`, {
      name: `@anyopsos/${this.packageType}-${argv.name}`,
      version: '0.0.1',
      main: 'src/index.ts',
      type: 'module',
      dependencies: {
        log4js: '^6.1.0',
      },
      peerDependencies: {
        '@anyopsos/module-api-globals': '~0.0.1'
      },
      devDependencies: {
        '@types/node': '^12.12.21',
        'class-validator': '^0.11.0',
        express: '^4.17.1',
        'routing-controllers': '^0.8.0',
        typescript: '^3.7.4'
      },
      homepage: 'https://github.com/anyOpsOS/anyOpsOS#readme',
      repository: {
        type: 'git',
        url: 'https://github.com/anyOpsOS/anyOpsOS.git'
      },
      bugs: 'https://github.com/anyOpsOS/anyOpsOS/issues',
      keywords: [],
      description: `anyOpsOS api ${argv.name}`,
      author: 'Isart Navarro <contact@isartnavarro.io> (https://isartnavarro.io)',
      license: 'GPL-3.0-or-later',
      private: true
    }, {spaces: 2});
    await outputFile(`${this.projectPath}/src/index.ts`, `export * from './lib/anyopsos-api-${argv.name}.module';`);
    await outputFile(`${this.projectPath}/src/lib/anyopsos-api-${argv.name}.module.ts`, `import {Controller, Get, Authorized, Req, Res} from 'routing-controllers';
import {Request, Response} from 'express';
import {getLogger} from 'log4js';

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';

const logger = getLogger('mainLog');

@Authorized()
@Controller('/api/${argv.name}')
export class ${fulldynamicModule} {

  @Get("/")
  get${dynamicModule}(@Req() request: Request,
                      @Res() response: Response) {
    logger.info(\`[API ${argv.name}] -> Default\`);

    return new AnyOpsOSApiGlobalsModule(request, response).validResponse();
  }

}
`);

  };

  /**
   * Create base module type files
   */
  private async createBaseModuleFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating Module base components.\n`));

    let dynamicModule = argv.name
      .toLowerCase()
      .replace(/-(.)/g, (match: any, group1: string) => group1.toUpperCase());

    dynamicModule = `AnyOpsOS${dynamicModule.charAt(0).toUpperCase()}${dynamicModule.slice(1)}Module`;

    await outputJson(`${this.projectPath}/package.json`, {
      name: `@anyopsos/${this.packageType}-${argv.name}`,
      version: '0.0.1',
      main: 'src/index.ts',
      type: 'module',
      devDependencies: {
        '@types/node': '^12.12.21',
        typescript: '^3.7.4'
      },
      homepage: 'https://github.com/anyOpsOS/anyOpsOS#readme',
      repository: {
        type: 'git',
        url: 'https://github.com/anyOpsOS/anyOpsOS.git'
      },
      bugs: 'https://github.com/anyOpsOS/anyOpsOS/issues',
      keywords: [],
      description: `anyOpsOS module ${argv.name}`,
      author: 'Isart Navarro <contact@isartnavarro.io> (https://isartnavarro.io)',
      license: 'GPL-3.0-or-later',
      private: true
    }, {spaces: 2});
    await outputFile(`${this.projectPath}/src/index.ts`, `export * from './lib/anyopsos-module-${argv.name}.module';`);
    await outputFile(`${this.projectPath}/src/lib/anyopsos-module-${argv.name}.module.ts`, `export class ${dynamicModule} {

  constructor() {
  }

}
`);

  };

  /**
   * Create base websocket type files
   */
  private async createBaseWebsocketFiles(argv: { type: Types; name: string; prefix: string; }): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating WebSocket base components.\n`));

    let dynamicModule = argv.name
      .toLowerCase()
      .replace(/-(.)/g, (match: any, group1: string) => group1.toUpperCase());

    dynamicModule = `${dynamicModule.charAt(0).toUpperCase()}${dynamicModule.slice(1)}`;

    const fulldynamicModule = `AnyOpsOS${dynamicModule}WebsocketController`;

    await outputJson(`${this.projectPath}/package.json`, {
      name: `@anyopsos/${this.packageType}-${argv.name}`,
      version: '0.0.1',
      main: 'src/index.ts',
      type: 'module',
      dependencies: {
        log4js: '^6.1.0',
      },
      peerDependencies: {
      },
      devDependencies: {
        '@types/node': '^12.12.21',
        'socket.io': '^2.3.0',
        'socket-controllers': '^0.0.5',
        typescript: '^3.7.4'
      },
      homepage: 'https://github.com/anyOpsOS/anyOpsOS#readme',
      repository: {
        type: 'git',
        url: 'https://github.com/anyOpsOS/anyOpsOS.git'
      },
      bugs: 'https://github.com/anyOpsOS/anyOpsOS/issues',
      keywords: [],
      description: `anyOpsOS websocket ${argv.name}`,
      author: 'Isart Navarro <contact@isartnavarro.io> (https://isartnavarro.io)',
      license: 'GPL-3.0-or-later',
      private: true
    }, {spaces: 2});
    await outputFile(`${this.projectPath}/src/index.ts`, `export * from './lib/anyopsos-websocket-${argv.name}.module';`);
    await outputFile(`${this.projectPath}/src/lib/anyopsos-websocket-${argv.name}.module.ts`, `import {SocketController, ConnectedSocket, SocketId, MessageBody, OnMessage} from 'socket-controllers';
import {getLogger} from 'log4js';
import {Socket} from 'socket.io';

const logger = getLogger('mainLog');

@SocketController()
export class ${fulldynamicModule} {

  @OnMessage("new_message")
  newMessageReceived(@ConnectedSocket() socket: Socket,
                     @SocketId() id: string,
                     @MessageBody() message: any) {
    logger.info(\`[Websocket ${argv.name}] -> new message -> id [\${id}]\`);

    socket.emit('message_received', message);
  }

}
`);

  };

  private setArgvData(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }) {
    this.packageType = argv.type === 'library' ? 'lib' :
      argv.type === 'external-library' ? 'ext-lib' :
        argv.type === 'application' ? 'app' :
          argv.type === 'modal' ? 'modal' :
            argv.type === 'api' ? 'api' :
              argv.type === 'module' ? 'module' :
                argv.type === 'websocket' ? 'websocket' :
                  argv.type;
    this.packageLongType = argv.type === 'library' ? 'libraries' :
      argv.type === 'external-library' ? 'external-libraries' :
        argv.type === 'application' ? 'applications' :
          argv.type === 'modal' ? 'modals' :
            argv.type === 'api' ? 'apis' :
              argv.type === 'api-middleware' ? 'api-middlewares' :
                argv.type === 'module' ? 'modules' :
                  argv.type === 'websocket' ? 'websockets' :
                    argv.type;
    this.packagePrefix = argv.type === 'library' ? 'al' :
      argv.type === 'external-library' ? 'ael' :
        argv.type === 'application' ? 'aa' :
          argv.type === 'modal' ? 'am' :
            argv.type;
    this.projectPath = `${MAIN_PATH_CWD}/projects/${this.packageLongType}/${argv.name ? argv.name : argv.moduleName}`;

    if (!argv.prefix) argv.prefix = argv.name;
  }

  async createModule(argv: { type: Types; name: string; prefix: string; }): Promise<void> {

    this.setArgvData(argv);

    if (pathExistsSync(this.projectPath)) return console.log('Module already exists');

    await this.createLibrary(argv);

    if (this.packageType === 'app' || this.packageType === 'modal' || this.packageType === 'lib' || this.packageType === 'ext-lib') {
      await this.moveLibraryToFinalLocation(argv);
      await this.standarizeLibraryFiles(argv);
      await this.deleteDefaultFiles(argv);
      await this.renameLibraryModuleFile(argv);
      await this.removeUnwantedCodeFromFiles(argv);
    }

    await this.copyLicenseFile();

    if (this.packageType === 'app') await this.createBaseApplicationFiles(argv);
    if (this.packageType === 'modal') await this.createBaseModalFiles(argv);
    if (this.packageType === 'lib' || this.packageType === 'ext-lib') await this.createBaseLibFiles(argv);
    if (this.packageType === 'api') await this.createBaseApiFiles(argv);
    if (this.packageType === 'module') await this.createBaseModuleFiles(argv);
    if (this.packageType === 'websocket') await this.createBaseWebsocketFiles(argv);
    if (this.packageType === 'api' || this.packageType === 'module' || this.packageType === 'websocket') {
      if (this.packageType !== 'api') await this.createReadMe(argv);
      await this.yarnInstall(argv);
    }
  }

}
