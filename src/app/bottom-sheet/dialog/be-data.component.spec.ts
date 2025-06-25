import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeDataComponent } from './be-data.component';

describe('BeDataComponent', () => {
  let component: BeDataComponent;
  let fixture: ComponentFixture<BeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
