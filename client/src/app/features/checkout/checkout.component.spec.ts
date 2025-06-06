import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { CheckoutComponent } from './checkout.component';
import { CheckoutService } from '../../core/services/checkout.service';
import { CartItemComponent } from '../cart/cart-item/cart-item.component';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { CheckoutRequest } from '../../core/models/checkout.model';

describe('CheckoutComponent', () => {
  let fixture: ComponentFixture<CheckoutComponent>;
  let component: CheckoutComponent;

  let cartServiceMock: jasmine.SpyObj<CartService>;
  let checkoutServiceMock: jasmine.SpyObj<CheckoutService>;
  let toastrMock: jasmine.SpyObj<ToastrService>;

  const mockCartItems: CartItem[] = [
    {
      _id: '1',
      quantity: 2,
      product: {
        _id: 'p1',
        name: 'Product 1',
        price: 50,
        stock: 10,
        imageUrl: '',
        description: 'desc',
      },
    },
  ];

  beforeEach(async () => {
    cartServiceMock = jasmine.createSpyObj('CartService', ['loadCartItems'], {
      cartItems: () => mockCartItems,
    });
    cartServiceMock.loadCartItems.and.returnValue(of(mockCartItems));
    
    checkoutServiceMock = jasmine.createSpyObj('CheckoutService', [
      'postCheckout',
    ]);
    toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, FormsModule, CartItemComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: CheckoutService, useValue: checkoutServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should call loadCartItems on ngOnInit', () => {
    expect(cartServiceMock.loadCartItems).toHaveBeenCalled();
  });

  it('should call confirmCheckout on button click', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate'); // ✅ spy ของ Router จริง

    checkoutServiceMock.postCheckout.and.returnValue(
      of({ message: 'success' })
    );
    spyOn(component, 'confirmCheckout').and.callThrough();

    const button = fixture.nativeElement.querySelector('button.w-full');
    button.click();

    const expectedPayload: CheckoutRequest = {
      paymentMethod: 'cash',
      cartItems: [
        {
          cartItemId: '1',
          product: 'p1',
          quantity: 2,
        },
      ],
    };

    expect(component.confirmCheckout).toHaveBeenCalled();
    expect(checkoutServiceMock.postCheckout).toHaveBeenCalledWith(
      expectedPayload
    );
    expect(toastrMock.success).toHaveBeenCalledWith('ชำระเงินเรียบร้อย');
    expect(navigateSpy).toHaveBeenCalledWith(['/products']); // ใช้ spy ที่สร้างจาก Router จริง
    expect(cartServiceMock.loadCartItems).toHaveBeenCalledTimes(2); // 1: ngOnInit, 2: หลัง checkout
  });

  it('should show error toastr on failed confirmCheckout', () => {
    checkoutServiceMock.postCheckout.and.returnValue(
      throwError(() => ({ error: { message: 'ไม่สามารถชำระเงินได้' } }))
    );

    component.confirmCheckout();

    expect(toastrMock.error).toHaveBeenCalledWith('ไม่สามารถชำระเงินได้');
  });

  it('should show error toastr on failed loadCartItems', () => {
    cartServiceMock.loadCartItems.and.returnValue(
      throwError(() => ({ error: { message: 'โหลดไม่สำเร็จ' } }))
    );

    component.ngOnInit();

    expect(toastrMock.error).toHaveBeenCalledWith('โหลดไม่สำเร็จ');
  });
});
