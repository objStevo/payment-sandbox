"use client";

import UpdateMerchantCookie from "@/components/custom/adyen/account/UpdateMerchantCookie";
import ShareableButton from "@/components/custom/sandbox/share/ShareableButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formulaActions, userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { clearUrlParams, refineFormula } from "@/utils/utils";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import Tooltip from "@mui/material/Tooltip";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const {
  updateRun,
  updateReset,
  resetFormula,
  updateIsRedirect,
  clearOnDeckInfo,
  resetUnsavedChanges,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
} = formulaActions;

const { updateView } = userActions;

const Topbar = (props: any) => {
  const storeFormula = useSelector((state: RootState) => state.formula);
  const { view, merchantAccount } = props;
  const { unsavedChanges } = storeFormula;
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  const containerRef = useRef<HTMLSpanElement>(null);

  const storeToLocalStorage = (data: any) => {
    sessionStorage.setItem("formula", JSON.stringify(data));
  };

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-y-2 stretch flex items-center justify-center px-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
      ref={containerRef}
    >
      <div className="flex justify-end pr-3">
        <Tooltip title="Developer">
          <span>
            <Button
              key="developer"
              variant="ghost"
              size="sm"
              className="border-foreground bg-background px-2"
              onClick={() => {
                dispatch(updateView("developer"));
                clearUrlParams(["view"]);
              }}
            >
              <ViewColumnIcon
                className={`!text-[16px] ${view === "developer" ? "text-adyen" : "text-foreground"}`}
              />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Preview">
          <span>
            <Button
              key="preview"
              variant="ghost"
              size="sm"
              className="bg-background border-foreground px-2"
              onClick={() => {
                dispatch(updateView("preview"));
                clearUrlParams(["view"]);
              }}
            >
              <VerticalSplitIcon
                className={`!text-[16px] ${
                  view === "preview" ? "text-adyen" : "text-foreground"
                }`}
              />
            </Button>
          </span>
        </Tooltip>
      </div>
      <div className="flex-1 text-center">
        <UpdateMerchantCookie />
      </div>
      <div className="flex justify-end">
        <div className="mr-2">
          <ShareableButton
            disabled={totalUnsavedChanges !== 0 || view == "user"}
          />
        </div>
        <div className="mr-2">
          <AlertDialog>
            <Tooltip title="Reset (⌘ + delete)">
              <AlertDialogTrigger asChild>
                <span>
                  <Button
                    key="reset"
                    disabled={view === "user"}
                    variant="ghost"
                    size="sm"
                    className="px-2 pt-0 pb-0"
                  >
                    <RestartAltIcon className="!text-foreground !text-[16px]" />
                  </Button>
                </span>
              </AlertDialogTrigger>
            </Tooltip>
            <AlertDialogPortal container={containerRef.current}>
              <AlertDialogOverlay />
              <AlertDialogContent className="text-foreground">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    This action will permanently delete your configuration and
                    reset back to the components base configuration. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      dispatch(resetFormula());
                      dispatch(
                        updateApiRequestMerchantAccount(merchantAccount)
                      );
                      dispatch(updateBuildMerchantAccount(merchantAccount));
                      dispatch(updateReset());
                      clearUrlParams([
                        "redirectResult",
                        "paRes",
                        "MD",
                        "sessionId",
                        "sessionData",
                      ]);
                    }}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogPortal>
          </AlertDialog>
        </div>
        <div className="mr-2 relative">
          <span className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground text-xs rounded-full">
            {totalUnsavedChanges !== 0 && totalUnsavedChanges}
          </span>
          <Tooltip title="Last Build (⌘ + b)">
            <span>
              <Button
                key="clear"
                variant="ghost"
                size="sm"
                className="px-2 pt-0 pb-0"
                disabled={totalUnsavedChanges === 0}
                onClick={() => {
                  dispatch(clearOnDeckInfo());
                  dispatch(updateReset());
                }}
              >
                <RestoreIcon className="!text-foreground !text-[16px]" />
              </Button>
            </span>
          </Tooltip>
        </div>
        <Tooltip title="Build (⌘ + enter)">
          <span>
            <Button
              key="run"
              variant="default"
              size="sm"
              className="px-4"
              onClick={() => {
                storeToLocalStorage(refineFormula(storeFormula));
                clearUrlParams([
                  "redirectResult",
                  "paRes",
                  "MD",
                  "sessionId",
                  "sessionData",
                ]);
                dispatch(updateIsRedirect(false));
                dispatch(updateRun());
                dispatch(resetUnsavedChanges());
              }}
            >
              Build
            </Button>
          </span>
        </Tooltip>
      </div>
    </span>
  );
};

export default Topbar;
