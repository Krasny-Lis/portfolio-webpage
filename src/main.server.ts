import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering()],
});

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;
