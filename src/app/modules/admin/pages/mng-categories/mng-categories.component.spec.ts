import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MngCategoriesComponent } from './mng-categories.component';

describe('MngCategoriesComponent', () => {
  let component: MngCategoriesComponent;
  let fixture: ComponentFixture<MngCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MngCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MngCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
