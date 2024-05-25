"use client";

import AdyenComponent from "@/components/custom/adyen/AdyenComponent";
import AdyenState from "@/components/custom/adyen/AdyenState";
import API from "@/components/custom/sandbox/backend/API";
import CSS from "@/components/custom/sandbox/frontend/CSS";
import HTML from "@/components/custom/sandbox/frontend/HTML";
import JS from "@/components/custom/sandbox/frontend/JS";
import SandboxLayout from "@/components/custom/sandbox/layout";
import Sidebar from "@/components/custom/sandbox/layout/sidebar";
import TabbedMain from "@/components/custom/sandbox/layout/tabbedMain";
import Events from "@/components/custom/sandbox/webhooks/Events";
import Topbar from "@/components/custom/sandbox/layout/topbar";

import { useState } from "react";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");

  return (
    <div>
      <Sidebar section={section} setSection={setSection} />
      <Topbar />
      {section === "client" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["HTML", "CSS", "JS"]}
              contents={[
                <HTML key={"HTML"} />,
                <CSS key={"CSS"} />,
                <JS key={"JS"} />,
              ]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "server" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["/PaymentMethods", "/Payments", "/Payment/Details"]}
              contents={[
                <API key={"paymentmethods"} />,
                <API key={"payments"} />,
                <API key={"paymentdetails"} />,
              ]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "webhooks" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["Events"]}
              contents={[<Events key={"Events"} />]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
    </div>
  );
};

export default Page;
