import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CartComponent } from './cart.component';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

describe('CartComponent (DOM)', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;

  const mockCartItems: CartItem[] = [
    {
      _id: 'item1',
      quantity: 2,
      product: { _id: 'prod1', name: 'Item 1', price: 100, stock: 10 },
    },
    {
      _id: 'item2',
      quantity: 1,
      product: { _id: 'prod2', name: 'Item 2', price: 200, stock: 5 },
    },
  ];

  const mockCartService = {
    cartItems: () => mockCartItems,
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

  it('should render all cart items in the DOM', () => {
    const cartItemEls = fixture.nativeElement.querySelectorAll('app-cart-item');
    expect(cartItemEls.length).toBe(2);
  });

  it('should display the correct total price', () => {
    const totalEl = fixture.nativeElement.querySelector('.text-green-600.text-lg');
    expect(totalEl.textContent).toContain('400'); // 100*2 + 200*1
  });

  it('should contain checkout button with routerLink', () => {
    const checkoutBtn = fixture.nativeElement.querySelector('button[routerlink="/checkout"]');
    expect(checkoutBtn).toBeTruthy();
    expect(checkoutBtn.textContent).toContain('Checkout');
  });
});

describe('CartComponent (loadCartItems fails)', () => {
  let fixture: ComponentFixture<CartComponent>;

  const errorCartService = {
    cartItems: () => [],
    loadCartItems: jasmine.createSpy().and.returnValue(
      throwError(() => ({ error: { message: 'load failed' } }))
    ),
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: errorCartService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    fixture.detectChanges();
  });

  it('should call toastr.error if loadCartItems fails', () => {
    expect(mockToastr.error).toHaveBeenCalledWith('load failed');
  });
});
