import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { of } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    const mockProductService = jasmine.createSpyObj('ProductService', [
      'getProductsBySearching',
    ]);

    TestBed.configureTestingModule({
      imports: [FormsModule, SearchComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit products on submit with valid search term', () => {
    const dummyProducts: Product[] = [{ name: 'Test Product' } as Product];
    const searchTerm = 'test';
    const emitSpy = spyOn(component.productsFound, 'emit');

    component.searchTerm = searchTerm;
    productServiceSpy.getProductsBySearching.and.returnValue(of(dummyProducts));

    component.onSubmit();

    expect(productServiceSpy.getProductsBySearching).toHaveBeenCalledWith(
      searchTerm
    );
    expect(emitSpy).toHaveBeenCalledWith(dummyProducts);
  });

  it('should emit undefined and reset form on clear', () => {
    const emitSpy = spyOn(component.productsFound, 'emit');
    const formDirective = {
      resetForm: jasmine.createSpy('resetForm'),
    } as unknown as NgForm;

    component.searchTerm = 'test';
    component.onClear(formDirective);

    expect(component.searchTerm).toBe('');
    expect(formDirective.resetForm).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith();
  });

  it('should call onSubmit when form is submitted via template', () => {
    const submitSpy = spyOn(component, 'onSubmit');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', {});
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should call onClear when ❌ button is clicked', () => {
    const clearSpy = spyOn(component, 'onClear').and.callThrough();
    const formElement = fixture.debugElement.query(By.css('form')).references[
      'searchForm'
    ];

    const clearButton = fixture.debugElement.queryAll(By.css('button'))[1];
    clearButton.triggerEventHandler('click', null);

    expect(clearSpy).toHaveBeenCalled();
  });
});
