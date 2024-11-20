import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action) {
            state.items = action.payload;
        },
        incrementQuantity(state, action) {
            const { id, color } = action.payload;
            const item = state.items.find(i => i.id === id && i.color === color);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity(state, action) {
            const { id, color } = action.payload;
            const item = state.items.find(i => i.id === id && i.color === color);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        removeItem(state, action) {
            const { id, color } = action.payload;
            state.items = state.items.filter(item => !(item.id === id && item.color === color));
        }
    },
});

export const { setCart, incrementQuantity, decrementQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;