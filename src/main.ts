import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import "./polyfills";

import { AppModule } from "./app/app.module";

enableProdMode();
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule, { preserveWhitespaces: true }).catch(err => console.error(err));