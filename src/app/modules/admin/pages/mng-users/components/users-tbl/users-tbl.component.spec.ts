import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTblComponent } from './users-tbl.component';

describe('UsersTblComponent', () => {
  let component: UsersTblComponent;
  let fixture: ComponentFixture<UsersTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersTblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
