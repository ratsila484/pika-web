import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './components/header/header.component';
import { BeComponent } from './components/be/be.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BeDataComponent } from './bottom-sheet/dialog/be-data.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { PourSignatureComponent } from './components/pour-signature/pour-signature.component';
import { EnregitrementComponent } from './components/enregitrement/enregitrement.component';
import { PdfViewerComponent } from './dialog/pdf-viewer/pdf-viewer.component';
import { BeSearchComponent } from './dialog/be-search/be-search.component';
import { PdfViewerBeComponent } from './dialog/pdf-viewer-be/pdf-viewer-be.component';
import { PdfViewerEnregComponent } from './dialog/pdf-viewer-enreg/pdf-viewer-enreg.component';
import { RegSearchComponent } from './dialog/reg-search/reg-search.component';
import { ArchivesComponent } from './components/archives/archives.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import { AccueilComponent } from './components/accueil/accueil.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BeComponent,
    BeDataComponent,
    PourSignatureComponent,
    EnregitrementComponent,
    PdfViewerComponent,
    BeSearchComponent,
    PdfViewerBeComponent,
    PdfViewerEnregComponent,
    RegSearchComponent,
    ArchivesComponent,
    StatistiqueComponent,
    AccueilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormField,
    MatLabel,
    MatSelectionList,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    BaseChartDirective
  ],
  providers: [provideClientHydration(withEventReplay()), provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent],
})
export class AppModule {}
