import { TvIcon } from "@heroicons/react/24/outline";

import { classNames } from "../../app/helpers/utils";
import { useWindowSize } from "../../app/hooks";

export default function Logo({ reset = false }) {
  const { width } = useWindowSize();
  const mobile = width !== undefined && width < 1024;

  return (
    <img
      src={reset ? "/images/logo.png" : "/images/logo-white.png"}
      className={mobile ? "h-8" : "h-10"}
    />
  );

  return (
    <span
      className={classNames(
        "font-bold leading-none flex items-center space-x-2.5 text-transparent bg-clip-text bg-gradient-to-r",
        reset ? "from-primary-800 to-teal" : " from-white to-[#DFE9EC]",
        mobile ? "text-[26px]" : "text-[35px]"
      )}
    >
      <span>HIALA TV</span>
      <TvIcon
        className={classNames(
          reset ? "text-teal" : "text-white",
          mobile ? "w-6" : "w-8"
        )}
      />
    </span>
  );
}
