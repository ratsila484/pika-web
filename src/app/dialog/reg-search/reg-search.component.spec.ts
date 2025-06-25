import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSearchComponent } from './reg-search.component';

describe('RegSearchComponent', () => {
  let component: RegSearchComponent;
  let fixture: ComponentFixture<RegSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
