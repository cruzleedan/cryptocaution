import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MngEntitesComponent } from './mng-entites.component';

describe('MngEntitesComponent', () => {
  let component: MngEntitesComponent;
  let fixture: ComponentFixture<MngEntitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MngEntitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MngEntitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
