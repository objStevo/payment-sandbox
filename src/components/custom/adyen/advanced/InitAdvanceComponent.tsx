"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenAdvance } from "@/hooks/useAdyenAdvance";
import { useApi } from "@/hooks/useApi";
import { useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const InitAdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
  } = props;

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion}/paymentMethods`,
    "POST",
    paymentMethodsRequest
  );

  const checkoutRef = useRef(null);
  // need to update state with the paymentMethodsResponse, but just pull paymentResponse for now

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenAdvance(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutRef
  );

  const error =
    adyenSDKError || paymentMethodsError
      ? { ...adyenSDKError, ...paymentMethodsError }
      : null;

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {adyenResult && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{adyenResult.resultCode}</AlertTitle>
          <AlertDescription>
            {`PSP Reference: ${adyenResult.pspReference}`}
          </AlertDescription>
        </Alert>
      )}
      {loadingPaymentMethods && (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      )}
      {!adyenSDKError && !adyenResult && !loadingPaymentMethods && (
        <div ref={checkoutRef}></div>
      )}
    </div>
  );
};