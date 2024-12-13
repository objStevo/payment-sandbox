import { ExpandableCards } from "@/components/custom/sandbox/navbars/ExpandableCards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/useApi";
import { userActions } from "@/store/reducers";
import { clearUrlParams } from "@/utils/utils";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Tooltip from "@mui/material/Tooltip";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../utils/Loading";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const { updateTheme, updateView } = userActions;

const Sidebar = (props: any) => {
  const {
    section,
    setSection,
    unsavedChanges,
    paymentMethodsMerchantAccount,
    variant,
    view,
    integration,
  } = props;
  const {
    html: htmlUnsavedChanges,
    style: styleUnsavedChanges,
    js: jsUnsavedChanges,
    paymentMethods: paymentMethodsUnsavedChanges,
    payments: paymentsUnsavedChanges,
    paymentsDetails: paymentsDetailsUnsavedChanges,
    events: eventsUnsavedChanges,
  } = unsavedChanges;

  const serverButtonRef = useRef<HTMLButtonElement>(null);
  const clientButtonRef = useRef<HTMLButtonElement>(null);
  const webhookButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
  } = useApi(
    `api/checkout/v71/paymentMethods`,
    "POST",
    paymentMethodsMerchantAccount
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        if (serverButtonRef.current) {
          serverButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "j") {
        event.preventDefault();
        if (clientButtonRef.current) {
          clientButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        if (webhookButtonRef.current) {
          webhookButtonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const sideTabs: Array<SideTab> = [
    {
      name: "Server",
      hotKey: "⌘ + i",
      icon: <StorageIcon className="!text-foreground !text-[20px]" />,
      unsavedChanges: {
        paymentMethodsUnsavedChanges,
        paymentsUnsavedChanges,
        paymentsDetailsUnsavedChanges,
      },
      ref: serverButtonRef,
    },
    {
      name: "Client",
      hotKey: "⌘ + j",
      icon: <LanguageIcon className="!text-foreground !text-[20px]" />,
      unsavedChanges: {
        htmlUnsavedChanges,
        styleUnsavedChanges,
        jsUnsavedChanges,
      },
      ref: clientButtonRef,
    },
    {
      name: "Webhooks",
      hotKey: "⌘ + k",
      icon: <WebhookIcon className="!text-foreground !text-[20px]" />,
      unsavedChanges: {
        eventsUnsavedChanges,
      },
      ref: webhookButtonRef,
    },
  ];

  const totalUnsavedChanges = (unsavedChanges: any) => {
    return Object.values(unsavedChanges).filter((value) => value).length;
  };
  return (
    <div ref={sidebarRef}>
      <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-[100%] border-2 text-center">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div>
              <Drawer direction="left">
                <span>
                  <DrawerTrigger className="mt-2 px-2 pb-2 pt-1 rounded-none border-[1px] border-transparent hover:border-[1px] hover:border-adyen hover:border-dotted hover:bg-accent hover:text-accent-foreground">
                    <WidgetsIcon className="!text-foreground !text-[19px]" />
                  </DrawerTrigger>
                </span>
                <DrawerPortal container={sidebarRef.current}>
                  <DrawerOverlay />
                  <DrawerContent className="h-full w-[20vw] rounded-none border-r-2 border-t-2 border-b-2">
                    <DrawerHeader className="pb-2">
                      <DrawerTitle className="text-foreground text-sm py-0">
                        <span className="flex items-center">
                          <ChevronDown className="h-4 w-4 pr-1 text-grey" />
                          <span className="display-inline">
                            Online Payments
                          </span>
                        </span>
                      </DrawerTitle>
                    </DrawerHeader>
                    <div>
                      <ExpandableCards
                        paymentMethodName={"Dropin"}
                        paymentMethodType={"dropin"}
                        defaultExpanded={variant === "dropin"}
                        defaultIntegration={integration}
                      />
                      {paymentMethodsResponse &&
                        paymentMethodsResponse.paymentMethods &&
                        paymentMethodsResponse.paymentMethods.map(
                          (paymentMethod: any) => (
                            <ExpandableCards
                              key={paymentMethod.type}
                              paymentMethodName={paymentMethod.name}
                              paymentMethodType={paymentMethod.type}
                              defaultExpanded={variant === paymentMethod.type}
                              defaultIntegration={integration}
                            />
                          )
                        )}
                      {loadingPaymentMethods && <Loading />}
                      {paymentMethodsError && (
                        <Alert variant="destructive">
                          <AlertTitle>
                            {"Error: Unable to save Payment methods"}
                          </AlertTitle>
                          <AlertDescription>
                            {paymentMethodsError}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </DrawerContent>
                </DrawerPortal>
              </Drawer>
            </div>
            {sideTabs.map((tab, index): any => (
              <span className="relative" key={index}>
                <Tooltip
                  title={`${tab.name} (${tab.hotKey})`}
                  placement="right-start"
                >
                  <span>
                    <Button
                      key={tab.name}
                      disabled={view === "demo"}
                      variant="ghost"
                      size="icon"
                      ref={tab.ref}
                      className={`mt-2 rounded-none ${
                        section === tab.name && view !== "demo"
                          ? "border-[1px] border-adyen"
                          : "hover:border-[1px] hover:border-adyen hover:border-dotted"
                      }`}
                      onClick={() => setSection(tab.name)}
                    >
                      {tab.icon}
                    </Button>
                  </span>
                </Tooltip>
                {totalUnsavedChanges(tab.unsavedChanges) !== 0 && (
                  <div className="w-4 h-4 border border-foreground rounded-full absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 bg-background text-foreground text-xxs">
                    {totalUnsavedChanges(tab.unsavedChanges)}
                  </div>
                )}
              </span>
            ))}
          </div>
          <div className="pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 pt-1 rounded-none border-none hover:border-[1px] hover:border-adyen hover:border-dotted">
                <SettingsIcon className="!text-foreground !text-[20px]" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal container={sidebarRef.current}>
                <DropdownMenuContent side="top" className="ml-1 rounded-none">
                  <DropdownMenuLabel className="text-xs">
                    Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted">
                      <p className="px-2">Shortcuts</p>
                      <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted">
                        <p className="px-2">Theme</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-none">
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted"
                          onClick={() => {
                            dispatch(updateTheme("dark"));
                          }}
                        >
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted"
                          onClick={() => {
                            dispatch(updateTheme("light"));
                          }}
                        >
                          <span>Light</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted">
                        <p className="px-2">View</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-none">
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("developer"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Developer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("preview"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-adyen hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("demo"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Demo</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
