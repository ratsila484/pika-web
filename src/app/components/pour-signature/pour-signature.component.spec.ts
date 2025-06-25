import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourSignatureComponent } from './pour-signature.component';

describe('PourSignatureComponent', () => {
  let component: PourSignatureComponent;
  let fixture: ComponentFixture<PourSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PourSignatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PourSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
