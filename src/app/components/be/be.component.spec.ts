import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeComponent } from './be.component';

describe('BeComponent', () => {
  let component: BeComponent;
  let fixture: ComponentFixture<BeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
