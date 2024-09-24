import { Button } from "@/components/ui/button";
import { formulaActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import RestoreIcon from "@mui/icons-material/Restore";
import { useDispatch, useSelector } from "react-redux";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Tooltip from "@mui/material/Tooltip";

const {
  updateRun,
  updateReset,
  updateIsRedirect,
  clearOnDeckInfo,
  resetUnsavedChanges,
} = formulaActions;

const Topbar = (props: any) => {
  const { unsavedChanges } = useSelector((state: RootState) => state.formula);
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  // Set the merchant account name in the top left corner, with the ability to edit the value. This will change the merchant account across all of the API requests. Although the user can always change it later. If the merchanat accounts are different than what is set then we throw a warning
  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-2 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <div className="mr-2 relative">
        <Tooltip title="Reset back to base.">
          <Button
            key="run"
            variant="outline"
            size="sm"
            className="px-2 pt-0 pb-0"
            onClick={() => {
              console.log("reset button clicked");
            }}
          >
            <RestartAltIcon sx={{ fontSize: "16px" }} />
          </Button>
        </Tooltip>
      </div>
      <div className="mr-2 relative">
        <span className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs rounded-full">
          {totalUnsavedChanges !== 0 && totalUnsavedChanges}
        </span>
        <Tooltip title="Reset back to last build.">
          <Button
            key="run"
            variant="outline"
            size="sm"
            className="px-2 pt-0 pb-0"
            onClick={() => {
              dispatch(clearOnDeckInfo());
              dispatch(updateReset(true));
            }}
          >
            <RestoreIcon sx={{ fontSize: "16px" }} />
          </Button>
        </Tooltip>
      </div>
      <Button
        key="run"
        variant="default"
        size="sm"
        className="px-4"
        onClick={() => {
          const clearRedirectInfo = () => {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          };
          clearRedirectInfo();
          dispatch(updateIsRedirect(false));
          dispatch(updateRun());
          dispatch(resetUnsavedChanges());
        }}
      >
        Run
      </Button>
    </span>
  );
};

export default Topbar;
