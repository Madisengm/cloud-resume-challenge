import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { AppInsightsService } from './core/services/app-insights.service';

function initAppInsights(appInsights: AppInsightsService) {
  return () => appInsights; 
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initAppInsights,
      deps: [AppInsightsService],
      multi: true,
    },
  ],
};