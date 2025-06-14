import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CartItemsRepository } from '../cart-items.repository';
import { CartItem } from '../schema/cart-item.schema';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';

describe('CartItemsRepository', () => {
  let repository: CartItemsRepository;

  const mockCartItem = {
    _id: '1',
    product: 'prod-123',
    quantity: 2,
  };

  const mockCartItems = [mockCartItem];

  const saveMock = jest.fn();
  const execMock = jest.fn();
  const populateMock = jest.fn();
  const leanMock = jest.fn();

  const mockModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    // bind mock chain AFTER mock functions exist
    populateMock.mockReturnValue({ exec: execMock });
    leanMock.mockReturnValue({ exec: execMock });

    mockModel.find.mockReturnValue({ populate: populateMock });
    mockModel.findOne.mockReturnValue({ lean: leanMock });
    mockModel.findByIdAndDelete.mockReturnValue({ lean: leanMock });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsRepository,
        {
          provide: getModelToken(CartItem.name),
          useValue: {
            ...mockModel,
            constructor: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<CartItemsRepository>(CartItemsRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new cart item and call save()', async () => {
      const dto: CreateCartItemDto = {
        product: 'prod-123',
        quantity: 2,
      };

      // Mock `new Model().save()` manually
      const mockSaveInstance = {
        save: saveMock.mockResolvedValue(mockCartItem),
      };
      const modelConstructor = jest.fn().mockReturnValue(mockSaveInstance);

      // override only for this test
      Object.defineProperty(repository, 'cartItemsModel', {
        value: Object.assign(modelConstructor, mockModel),
      });

      const result = await repository.create(dto);

      expect(modelConstructor).toHaveBeenCalledWith(dto);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('findAll', () => {
    it('should return all cart items with populated product', async () => {
      execMock.mockResolvedValueOnce(mockCartItems);

      const result = await repository.findAll();

      expect(mockModel.find).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalledWith('product');
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockCartItems);
    });
  });

  describe('findOne', () => {
    it('should return one cart item by product ID', async () => {
      execMock.mockResolvedValueOnce(mockCartItem);
      const productId = 'prod-123';

      const result = await repository.findOne(productId);

      expect(mockModel.findOne).toHaveBeenCalledWith({ product: productId });
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('deleteById', () => {
    it('should delete cart item by _id and return the deleted item', async () => {
      execMock.mockResolvedValueOnce(mockCartItem);
      const id = '1';

      const result = await repository.deleteById(id);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });
});
