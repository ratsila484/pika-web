import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerEnregComponent } from './pdf-viewer-enreg.component';

describe('PdfViewerEnregComponent', () => {
  let component: PdfViewerEnregComponent;
  let fixture: ComponentFixture<PdfViewerEnregComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfViewerEnregComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerEnregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
