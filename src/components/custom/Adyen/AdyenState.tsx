import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const AdyenState = () => {
  const { variantState } = useSelector(
    (state: RootState) => state.adyenVariant
  );
  console.log(variantState);
  return (
    <div className="flex">
      <div className="flex codemirror-wrapper ">
        <CodeMirror
          value={JSON.stringify(variantState)}
          height="100%"
          theme={githubLight}
          extensions={[javascript({ jsx: true })]}
        />
      </div>
    </div>
  );
};

export default AdyenState;
