import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTblComponent } from './categories-tbl.component';

describe('CategoriesTblComponent', () => {
  let component: CategoriesTblComponent;
  let fixture: ComponentFixture<CategoriesTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesTblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
