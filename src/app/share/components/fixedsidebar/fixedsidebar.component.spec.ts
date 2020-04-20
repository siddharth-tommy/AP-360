import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedsidebarComponent } from './fixedsidebar.component';

describe('FixedsidebarComponent', () => {
  let component: FixedsidebarComponent;
  let fixture: ComponentFixture<FixedsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
