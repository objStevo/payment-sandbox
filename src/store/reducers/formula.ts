import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface Formula {
  checkoutConfiguration: FormulaPropType;
  checkoutAPIVersion: "67" | "68" | "69" | "70";
  adyenWebVersion: string;
  txVariant: string;
  txVariantConfiguration: FormulaPropType;
  sessionsRequest: FormulaPropType;
  paymentMethodsRequest: FormulaPropType;
  paymentsRequest: FormulaPropType;
  paymentsDetailsRequest: FormulaPropType;
  style: FormulaPropType;
  isRedirect: boolean;
  unsavedChanges: number;
  build: Formula | null;
  run: boolean;
  redirectResult: string | null;
}

// Define the initial state
const initialState: FormulaPropType = {
  checkoutAPIVersion: "70",
  adyenWebVersion: "5.66.1",
  checkoutConfiguration: {
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
    environment: "test",
  },
  txVariant: "",
  txVariantConfiguration: {},
  sessionsRequest: {},
  paymentMethodsRequest: {
    shopperReference: "Hernan",
  },
  paymentsRequest: {
    countryCode: "NL",
    amount: {
      value: 10000,
      currency: "EUR",
    },
    channel: "Web",
    returnUrl: "http://localhost:3000/advanced/dropin",
    reference: "reference",
    shopperLocale: "en_US",
    merchantAccount: "HernanChalco",
  },
  paymentsDetailsRequest: {},
  style: {},
  unsavedChanges: 0,
  isRedirect: false,
  build: null,
  run: true,
  redirectResult: null,
};

// Add the build key to the initial state
initialState.build = { ...initialState };

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateRun: (state) => {
      state.unsavedChanges = 0;
      state.build = { ...state };
      state.run = !state.run;
    },
    updateFormula: (state, action: PayloadAction<Partial<Formula>>) => {
      return { ...state, ...action.payload };
    },
    updateCheckoutConfiguration: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.unsavedChanges += 1;
      state.checkoutConfiguration = action.payload;
    },
    addUnsavedChanges: (state) => {
      state.unsavedChanges += 1;
    },
    resetUnsavedChanges: (state) => {
      state.unsavedChanges = 0;
    },
    updateCheckoutAPIVersion: (
      state,
      action: PayloadAction<"67" | "68" | "69" | "70">
    ) => {
      // what if action.payload !== state.checkoutAPIVersion
      // and we already incremented unsavedChanges?
      // Then we dont want to increment again
      // We need to maintain a list of changes per tab, then sum the total to display
      if (state.build.checkoutAPIVersion !== action.payload) {
        state.unsavedChanges += 1;
      } else {
        state.unsavedChanges -= 1;
      }

      state.checkoutAPIVersion = action.payload;
    },
    updateAdyenWebVersion: (state, action: PayloadAction<string>) => {
      if (state.build.adyenWebVersion !== action.payload) {
        state.unsavedChanges += 1;
      } else {
        state.unsavedChanges -= 1;
      }

      state.adyenWebVersion = action.payload;
    },
    updateIsRedirect: (state, action: PayloadAction<boolean>) => {
      state.isRedirect = action.payload;
    },
    updateRedirectResult: (state, action: PayloadAction<string>) => {
      state.redirectResult = action.payload;
    },
    updateTxVariant: (state, action: PayloadAction<string>) => {
      state.txVariant = action.payload;
    },
    updateTxVariantConfiguration: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.unsavedChanges += 1;
      state.txVariantConfiguration = action.payload;
    },
    updateSessionsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      state.unsavedChanges += 1;
      state.sessionsRequest = action.payload;
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.unsavedChanges += 1;
      state.paymentMethodsRequest = action.payload;
    },
    updatePaymentsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      state.unsavedChanges += 1;
      state.paymentsRequest = action.payload;
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.unsavedChanges += 1;
      state.paymentsDetailsRequest = action.payload;
    },
    clearOnDeckInfo: (state) => {
      const lastBuild = state.build;
      return { ...lastBuild, build: lastBuild, run: state.run, unsavedChanges: 0 };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;
