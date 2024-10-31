import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface ComponentPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface Component {
  componentState: ComponentPropType;
}

// Define the initial state
const initialState: Component = {
  componentState: {},
};

// Create the slice with typed reducers
const variantSlice = createSlice({
  name: "Component",
  initialState,
  reducers: {
    updateComponent: (state, action: PayloadAction<Partial<Component>>) => {
      return { ...state, ...action.payload };
    },
    updateComponentState: (
      state,
      action: PayloadAction<ComponentPropType>
    ) => {
      state.componentState = action.payload;
    },
    clearComponent: () => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = variantSlice;