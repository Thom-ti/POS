import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CartComponent } from './cart.component';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const mockCartItems: CartItem[] = [
    {
      _id: 'item1',
      quantity: 2,
      product: {
        _id: 'prod1',
        name: 'Item 1',
        price: 100,
        stock: 10,
      },
    },
    {
      _id: 'item2',
      quantity: 1,
      product: {
        _id: 'prod2',
        name: 'Item 2',
        price: 200,
        stock: 5,
      },
    },
  ];

  const mockCartService = {
    cartItems: signal<CartItem[]>(mockCartItems),
    loadCartItems: jasmine.createSpy().and.returnValue(of({})),
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents(); // สร้าง "module จำลอง" เพื่อเทส Component

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance; // fixture.componentInstance → เข้าถึง instance (เหมือน this ของ component)
    fixture.detectChanges(); // fixture.detectChanges() → trigger Angular lifecycle (ngOnInit, re-render)
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items from service', () => {
    expect(component.cartItems()).toEqual(mockCartItems);
    expect(mockCartService.loadCartItems).toHaveBeenCalled();
  });

  it('should compute total price correctly', () => {
    const expectedTotal = 100 * 2 + 200 * 1;
    expect(component.totalPrice()).toBe(expectedTotal);
  });
});
