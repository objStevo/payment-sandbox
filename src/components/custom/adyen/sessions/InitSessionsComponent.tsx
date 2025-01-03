"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdyenSessions } from "@/hooks/useAdyenSessions";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useState } from "react";
import Error from "@/components/custom/utils/Error";
import Loading from "@/components/custom/utils/Loading";
import Result from "@/components/custom/utils/Result";

export const InitSessionsComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    adyenWebVersion,
    checkoutConfiguration,
    variant,
    txVariantConfiguration,
    sessionsRequest,
    onSessionsResponse,
    onChange,
  } = props;

  const {
    data: sessionsResponse,
    loading: loadingSessions,
    error: sessionError,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion.sessions}/sessions`,
    "POST",
    sessionsRequest
  );
  const [readyToMount, setReadyToMount] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (sessionsResponse && !sessionError) {
      onSessionsResponse(sessionsResponse);
      setReadyToMount(true);
    }
  }, [sessionsResponse]);

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenSessions(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    sessionsResponse,
    checkoutRef,
    onChange,
    readyToMount,
    adyenWebVersion
  );

  const error =
    adyenSDKError || sessionError
      ? { ...adyenSDKError, ...sessionError }
      : null;

  return (
    <div className="flex justify-center items-center h-[100%]">
      {error && <Error error={error} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loadingSessions && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <Loading className="text-foreground" />
        </div>
      )}
      {!adyenSDKError && !adyenResult && !loadingSessions && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <div className="px-auto !border-red" ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
