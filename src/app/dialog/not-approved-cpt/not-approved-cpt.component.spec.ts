import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotApprovedCptComponent } from './not-approved-cpt.component';

describe('NotApprovedCptComponent', () => {
  let component: NotApprovedCptComponent;
  let fixture: ComponentFixture<NotApprovedCptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotApprovedCptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotApprovedCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
