import 'reflect-metadata';

import {INTERNAL_PATH_CWD, MAIN_PATH_CWD} from '../constants';
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@anyopsos', `${MAIN_PATH_CWD}/dist/anyOpsOS/fileSystem/filesystem/bin/modules/`);

import {getFromContainer, MetadataStorage} from 'class-validator';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import {createExpressServer, getMetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {writeJson} from 'fs-extra';
import {blueBright} from 'chalk';
import * as Converter from 'api-spec-converter';

import {runInDocker} from '../utils';


const routingControllersOptions = {
  controllers: [`${MAIN_PATH_CWD}/dist/apis/*/lib/*.js`]
};
createExpressServer(routingControllersOptions);

// Parse class-validator classes into JSON Schema:
const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
const schemas = validationMetadatasToSchemas(metadatas, {
  refPointerPrefix: '#/components/schemas/'
});

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http'
      }
    }
  },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'A sample API',
    version: '1.0.0'
  }
});

console.log(blueBright(`[anyOpsOS Cli. Internals] Generating APIs swagger.json file.`));
Converter.convert({
  from: 'openapi_3',
  to: 'swagger_2',
  source: spec,
}).then(async (converted): Promise<void> => {

  console.log(blueBright(`[anyOpsOS Cli. Internals] Copying API Main swagger.json file.\n`));
  await writeJson(
    `${process.cwd()}/projects/apis/swagger.json`,
    converted.spec,
    {spaces: 2}
  );

  // Generate one swagger file per api project
  const projects = [];

  Object.keys(converted.spec.paths).map((path: string) => {

    let projectName = path.split('/')[2];

    // TODO hardcoded
    projectName = projectName.includes('vmware-') ? 'vmware' : projectName.includes('netapp-') ? 'netapp' : projectName;

    if (!projects[projectName]) {
      projects[projectName] = {
        info: {
          title: 'A sample API',
          version: '1.0.0',
          description: 'Generated with `routing-controllers-openapi`'
        },
        swagger: '2.0',
        projectName,
        paths: {}
      };
    }

    projects[projectName].paths = {...projects[projectName].paths, [path]: converted.spec.paths[path]};
  });

  for (const project of Object.keys(projects)) {
    console.log(blueBright(`[anyOpsOS Cli. Internals] Copying API ${projects[project].projectName} swagger.json file.`));
    await writeJson(
      `${process.cwd()}/projects/apis/${projects[project].projectName}/swagger.json`,
      projects[project],
      {spaces: 2}
    );

    console.log(blueBright(`[anyOpsOS Cli. Internals] Generating API ${projects[project].projectName} README file.`));
    await runInDocker(`swagger-markdown --input ${INTERNAL_PATH_CWD}/projects/apis/${projects[project].projectName}/swagger.json --output ${INTERNAL_PATH_CWD}/projects/apis/${projects[project].projectName}/README.md`);
  }

});
