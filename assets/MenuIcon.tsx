import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function MenuIcon(props: SvgProps) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M11.447 13h18M11.447 20h11M11.447 27h7"
        stroke="#1C191C"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default MenuIcon;
