import Enum from "@/components/custom/sandbox/editors/Enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Version = (props: any) => {
  const { label, value, options, onChange } = props;
  return (
    <div>
      <span className="border-b-2 flex text-sm">
        <span className="border-r-2 p-[3px] text-foreground">
          <p className="inline-block border border-info border-dotted px-2 text-sm">
            version
          </p>
        </span>
      </span>
      <Accordion type="multiple" className="w-full py-0 border-b-[1px]">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-3 px-4">
            <h4 className="text-[0.85rem] text-adyen">
              {`${label}`}
              <code className="px-1 text-xs text-grey">{`v${value}`}</code>
            </h4>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs px-4 pb-1 text-foreground">
              {`Change the version of ${label}`}
            </p>
            <div className="px-3">
              <Enum
                value={value}
                set={options}
                title="Checkout API Version"
                onChange={(value: any) => {
                  onChange(value);
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Version;
