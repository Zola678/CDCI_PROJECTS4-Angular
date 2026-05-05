import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProducts } from './user-products';

describe('UserProducts', () => {
  let component: UserProducts;
  let fixture: ComponentFixture<UserProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
