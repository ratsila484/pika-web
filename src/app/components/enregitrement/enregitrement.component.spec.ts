import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregitrementComponent } from './enregitrement.component';

describe('EnregitrementComponent', () => {
  let component: EnregitrementComponent;
  let fixture: ComponentFixture<EnregitrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnregitrementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregitrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
