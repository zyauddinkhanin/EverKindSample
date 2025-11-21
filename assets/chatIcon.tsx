import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function ChatIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 13.821 2.487 15.53 3.338 17L2.5 21.5L7 20.662C8.51963 21.5408 10.2445 22.0024 12 22Z"
        stroke="#7C7078"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChatIcon;
