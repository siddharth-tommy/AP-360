import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedmenubarComponent } from './fixedmenubar.component';

describe('FixedmenubarComponent', () => {
  let component: FixedmenubarComponent;
  let fixture: ComponentFixture<FixedmenubarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedmenubarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedmenubarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
