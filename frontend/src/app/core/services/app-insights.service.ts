import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppInsightsService {
  private appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: environment.appInsightsConnectionString,
        enableAutoRouteTracking: true,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
      },
    });
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
  }

  trackEvent(name: string, properties?: Record<string, string>): void {
    this.appInsights.trackEvent({ name }, properties);
  }

  trackException(error: Error): void {
    this.appInsights.trackException({ exception: error });
  }

  trackPageView(name?: string): void {
    this.appInsights.trackPageView({ name });
  }
}