import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtConfig, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

const providerSplashScreen: Provider = [
  { provide: APP_INITIALIZER, multi: true, useFactory: loadCrucialData() },
];

const jwtConfig: JwtConfig = {
  tokenGetter: () => localStorage.getItem('accessToken'),
  allowedDomains: [environment.API_URL],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    providerSplashScreen,
    importProvidersFrom(JwtModule.forRoot({ config: jwtConfig })),
    provideToastr(),
  ],
};

// Delay Splash Screen
function loadCrucialData() {
  return function () {
    return delay(0);
  };
}

function delay(delay: number) {
  return function () {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  };
}
