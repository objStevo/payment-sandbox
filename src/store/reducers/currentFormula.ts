import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface CurrentFormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface CurrentFormula {
  checkoutConfiguration: CurrentFormulaPropType;
  checkoutAPIVersion: "67" | "68" | "69" | "70";
  adyenWebVersion: string;
  txVariantConfiguration: CurrentFormulaPropType;
  sessionsRequest: CurrentFormulaPropType;
  sessionsResponse: CurrentFormulaPropType;
  paymentMethodsRequest: CurrentFormulaPropType;
  paymentMethodsResponse: CurrentFormulaPropType;
  paymentsRequest: CurrentFormulaPropType;
  paymentsResponse: CurrentFormulaPropType;
  paymentsDetailsRequest: CurrentFormulaPropType;
  paymentsDetailsResponse: CurrentFormulaPropType;
  style?: CurrentFormulaPropType;
  [key: string]: any;
}

// Define the initial state
const initialState: CurrentFormula = {
  checkoutAPIVersion: "70",
  adyenWebVersion: "5.64.0",
  checkoutConfiguration: {},
  txVariantConfiguration: {},
  sessionsRequest: {},
  sessionsResponse: {},
  paymentMethodsRequest: {},
  paymentMethodsResponse: {},
  paymentsRequest: {},
  paymentsResponse: {},
  paymentsDetailsRequest: {},
  paymentsDetailsResponse: {},
  style: {},
};

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateFormula: (state, action: PayloadAction<Partial<CurrentFormula>>) => {
      return { ...state, ...action.payload };
    },
    updateCheckoutConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.checkoutConfiguration = action.payload;
    },
    updateCheckoutAPIVersion: (
      state,
      action: PayloadAction<string>
    ) => {
      state.checkoutAPIVersion = action.payload;
    },
    updateAdyenWebVersion: (
      state,
      action: PayloadAction<string>
    ) => {
      state.adyenWebVersion = action.payload;
    },
    updateTxVariantConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.txVariantConfiguration = action.payload;
    },

    updateSessionsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.sessionsRequest = action.payload;
    },
    updateSessionsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.sessionsResponse = action.payload;
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentMethodsRequest = action.payload;
    },
    updatePaymentMethodsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentMethodsResponse = action.payload;
    },
    updatePaymentsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsRequest = action.payload;
    },
    updatePaymentsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsResponse = action.payload;
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsDetailsRequest = action.payload;
    },
    updatePaymentsDetailsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsDetailsResponse = action.payload;
    },
    clearOnDeckInfo: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;