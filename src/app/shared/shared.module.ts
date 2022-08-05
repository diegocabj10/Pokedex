import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { createTranslateLoader } from '../core/translator/create-translate-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomMissingTranslationHandler } from '../core/translator/missing-translation-handler';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler,
      },
    }),
    HttpClientModule
  ],
  exports: [NavbarComponent],
})
export class SharedModule {}
