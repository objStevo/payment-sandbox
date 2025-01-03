import Enum from "@/components/custom/sandbox/editors/Enum";
import { String } from "@/components/custom/sandbox/editors/String";
import Array from "@/components/custom/sandbox/editors/Array";
import { parseStringWithLinks } from "@/components/custom/utils/Utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { resolveRef } from "@/utils/utils";

const OpenApiList = (props: any) => {
  const {
    openApi,
    properties,
    selectedProperties,
    values,
    setValues,
    onChange,
    required,
  } = props;

  const propertyKeys = properties ? Object.keys(properties) : [];

  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={selectedProperties}
      onValueChange={onChange}
    >
      {propertyKeys.length === 0 && (
        <div className="pl-6 pr-4 py-3">
          <p className="text-sm text-foreground">
            {`0 matching results`}
          </p>
        </div>
      )}
      {propertyKeys.length > 0 &&
        propertyKeys.map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline"
          >
            <AccordionTrigger className="pl-6 pr-4 py-3">
              <p className="text-[0.85rem] text-foreground">{property}</p>
              <p className="font-mono text-xs flex-grow text-left">
                {properties[property].type && (
                  <span className="pl-2 text-grey">
                    {properties[property].type}
                  </span>
                )}
                {!properties[property].type && (
                  <span className="pl-2 text-grey">{"object"}</span>
                )}
                {required?.indexOf(property) > -1 && (
                  <span className="pl-2 text-warning">Required</span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 pr-4">
                <p className="text-xs pb-2 text-foreground">
                  {properties[property] &&
                    properties[property].description &&
                    parseStringWithLinks(properties[property].description)}
                </p>
                {properties[property].type === "string" &&
                  !properties[property].enum && (
                    <String
                      value={values[property] ? values[property] : ""}
                      onChange={(value: any) => {
                        let tidyValue = value !== undefined ? value : "";
                        setValues({ ...values, [property]: tidyValue });
                      }}
                    />
                  )}
                {properties[property].type === "string" &&
                  properties[property].enum && (
                    <Enum
                      value={
                        values[property] !== undefined ? values[property] : ""
                      }
                      onChange={(value: any) => {
                        let tidyValue = value !== undefined ? value : "";
                        setValues({ ...values, [property]: tidyValue });
                      }}
                      set={properties[property].enum}
                    />
                  )}
                {properties[property].type === "integer" && (
                  <String
                    value={values[property] ? values[property] : 0}
                    onChange={(value: any) => {
                      let tidyValue =
                        value !== undefined || value !== null
                          ? parseInt(value)
                          : 0;
                      setValues({ ...values, [property]: tidyValue });
                    }}
                  />
                )}
                {properties[property].type === "boolean" && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].toString()
                        : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value === "true" ? true : false;
                      setValues({ ...values, [property]: tidyValue });
                    }}
                    set={["true", "false"]}
                  />
                )}
                {properties[property].type === "array" && (
                  <Array
                    value={values[property] ? values[property] : []}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : [];
                      setValues({ ...values, [property]: tidyValue });
                    }}
                  />
                )}
                {properties[property]["$ref"] && openApi && (
                  <div className="border-l-[1px]">
                    <OpenApiList
                      schema={openApi}
                      properties={
                        resolveRef(openApi, properties[property]["$ref"]) &&
                        resolveRef(openApi, properties[property]["$ref"])
                          .properties
                          ? resolveRef(openApi, properties[property]["$ref"])
                              .properties
                          : []
                      }
                      required={
                        resolveRef(openApi, properties[property]["$ref"]) &&
                        resolveRef(openApi, properties[property]["$ref"])
                          .required
                          ? resolveRef(openApi, properties[property]["$ref"])
                              .required
                          : []
                      }
                      selectedProperties={
                        values &&
                        values[property] &&
                        Object.keys(values[property])
                          ? Object.keys(values[property])
                          : []
                      }
                      values={values[property] ? values[property] : {}}
                      setValues={(value: any) => {
                        setValues({ ...values, [property]: value });
                      }}
                      onChange={(value: any) => {
                        const requestParameters =
                          values &&
                          values[property] &&
                          Object.keys(values[property]);
                        const isNewProperty =
                          requestParameters.length < value.length;
                        if (isNewProperty) {
                          const latestKey = value[value.length - 1];
                          const latestValue = resolveRef(
                            openApi,
                            properties[property]["$ref"]
                          ).properties[latestKey];
                          let newProperty = null;
                          let mergedProperties = null;
                          if (latestValue.type === "string") {
                            newProperty = { [latestKey]: "" };
                          } else if (latestValue.type === "boolean") {
                            newProperty = { [latestKey]: true };
                          } else if (latestValue.type === "integer") {
                            newProperty = { [latestKey]: 0 };
                          } else if (latestValue.type === "array") {
                            newProperty = { [latestKey]: [] };
                          } else if (!latestValue.type) {
                            newProperty = { [latestKey]: {} };
                          } else if (latestValue.type === "object") {
                            newProperty = { [latestKey]: {} };
                          }
                          mergedProperties = {
                            ...values[property],
                            ...newProperty,
                          };
                          setValues({
                            ...values,
                            [property]: mergedProperties,
                          });
                        } else {
                          const removedProperties: any =
                            requestParameters.filter((i: any) => {
                              return value.indexOf(i) < 0;
                            });
                          if (removedProperties.length > 0) {
                            let updatedRequest = { ...values[property] };
                            let removedProperty = removedProperties.pop();
                            delete updatedRequest[removedProperty];
                            setValues({
                              ...values,
                              [property]: updatedRequest,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default OpenApiList;
