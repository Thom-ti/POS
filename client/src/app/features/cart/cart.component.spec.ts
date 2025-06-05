import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CartItem } from '../../core/models/cart-item.model';

describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;

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
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items from service', () => {
    expect(component.cartItems()).toEqual(mockCartItems);
    expect(mockCartService.loadCartItems).toHaveBeenCalled();
  });

  it('should compute total price correctly', () => {
    const expectedTotal = 100 * 2 + 200 * 1; // 400
    expect(component.totalPrice()).toBe(expectedTotal);
  });

  it('should show error toast on loadCartItems failure', waitForAsync(() => {
    const failService = {
      cartItems: signal<CartItem[]>([]),
      loadCartItems: jasmine
        .createSpy()
        .and.returnValue(
          throwError(() => ({ error: { message: 'โหลดล้มเหลว' } }))
        ),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: failService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    })
      .compileComponents()
      .then(() => {
        const failFixture = TestBed.createComponent(CartComponent);
        failFixture.detectChanges();

        expect(mockToastr.error).toHaveBeenCalledWith('โหลดล้มเหลว');
      });
  }));
});
