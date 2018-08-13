import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MngUsersComponent } from './mng-users.component';

describe('MngUsersComponent', () => {
  let component: MngUsersComponent;
  let fixture: ComponentFixture<MngUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MngUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MngUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
