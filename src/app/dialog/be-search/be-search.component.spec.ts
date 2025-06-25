import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeSearchComponent } from './be-search.component';

describe('BeSearchComponent', () => {
  let component: BeSearchComponent;
  let fixture: ComponentFixture<BeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
