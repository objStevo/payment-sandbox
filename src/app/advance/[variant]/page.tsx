"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import Code from "@/components/custom/sandbox/editors/Code";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import Style from "@/components/custom/sandbox/tabs/Style";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "Client" | "Server" | "Webhooks";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
} = formulaActions;


const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");

  const { componentState } = useSelector((state: RootState) => state.component);
  const { theme } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();

  const { run, unsavedChanges, request, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.formula
  );
  const { paymentMethods, payments, paymentsDetails } = request;
  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentsDetails: paymentsDetailsAPIVersion,
  } = checkoutAPIVersion;

  let tabsMap: any = [];
  let crumbs: Array<string> = [];
  let topRightTabsMap = [
    {
      title: `${variant}`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-preview">
            preview
          </span>
        </span>
      ),
      content: <ManageAdvanceComponent key={run ? "run" : "default"} />,
      value: variant,
    },
  ];

  let bottomRightTabsMap = [
    {
      title: `${variant} (read-only)`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-info">state</span>
        </span>
      ),
      content: (
        <Code
          code={JSON.stringify(componentState)}
          theme={theme}
          type="json"
          readOnly={true}
        />
      ),
      value: "state",
    },
  ];
  if (section === "Client") {
    tabsMap = [
      {
        title: `${variant ? variant : "checkout"}.js`,
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
          </span>
        ),
        content: <Script key={"script"} />,
        value: `${variant}.js`,
        unsavedChanges: unsavedChanges.js,
      },
      {
        title: "style.css",
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-info">{"#"}</span>
          </span>
        ),
        content: <Style key={"stye"} />,
        value: "style.css",
        unsavedChanges: unsavedChanges.style,
      },
      {
        title: "checkout.html (read-only)",
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-warning">
              {"</>"}
            </span>
          </span>
        ),
        content: <Html key={"html"} />,
        value: "checkout.html",
        unsavedChanges: unsavedChanges.html,
      },
    ];
    crumbs = ["advanced", variant, "client"];
  } else if (section === "Server") {
    tabsMap = [
      {
        title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="paymentMethods"
            schema="PaymentMethodsRequest"
            request={paymentMethods}
            updateRequest={updatePaymentMethodsRequest}
          />
        ),
        value: "paymentmethods",
      },
      {
        title: `/v${paymentsAPIVersion}/payments`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="payments"
            schema="PaymentRequest"
            request={payments}
            updateRequest={updatePaymentsRequest}
          />
        ),
        value: "payments",
      },
      {
        title: `/v${paymentsDetailsAPIVersion}/payment/details`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="paymentsDetails"
            schema="PaymentDetailsRequest"
            request={paymentsDetails}
            updateRequest={updatePaymentsDetailsRequest}
          />
        ),
        value: "paymentsDetails",
        unsavedChanges: unsavedChanges.paymentsDetails,
      },
    ];
    crumbs = ["advanced", variant, "server"];
  } else if (section === "Webhooks") {
    tabsMap = [
      {
        title: "webhooks",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">
            {"event"}
          </span>
        ),
        content: <Events key={"Events"} />,
        value: "events",
      },
    ];
    crumbs = ["advanced", variant];
  }

  return (
    <body className={`${theme}`}>
      <header>
        <Topbar />
      </header>
      <main>
        <Sandbox
          main={<SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />}
          topRight={<SandBoxTabs tabsMap={topRightTabsMap} />}
          bottomRight={<SandBoxTabs tabsMap={bottomRightTabsMap} />}
        />
      </main>
      <footer>
        <Sidebar
          section={section}
          setSection={setSection}
          unsavedChanges={unsavedChanges}
        />
      </footer>
    </body>
  );
};

export default Page;
