import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function MicroPhoneIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 6v12M9 9v6m9-4v2M6 11v2m9-6v10m-3 5c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        stroke="#100212"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MicroPhoneIcon;
