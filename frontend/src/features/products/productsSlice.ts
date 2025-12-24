import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, RootState } from '@/types';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProductsState = {
  items: [],
  status: 'idle'
};

export const fetchProductsByUser = createAsyncThunk<Product[], string>(
  'products/fetchByUser',
  async (userId: string) => {
    const response = await fetch(`/api/products/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    return response.json() as Promise<Product[]>;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByUser.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchProductsByUser.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;

export default productsSlice.reducer;
