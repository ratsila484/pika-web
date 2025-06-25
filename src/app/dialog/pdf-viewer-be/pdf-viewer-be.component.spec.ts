import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerBeComponent } from './pdf-viewer-be.component';

describe('PdfViewerBeComponent', () => {
  let component: PdfViewerBeComponent;
  let fixture: ComponentFixture<PdfViewerBeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfViewerBeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerBeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
