// icon:microphone-off | Boxicons https://boxicons.com/?query=microphone
import * as React from "react";

function MutedMicrophone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="m21.707 20.293-3.4-3.4A7.93 7.93 0 0 0 20 12h-2a5.945 5.945 0 0 1-1.119 3.467l-1.449-1.45A3.926 3.926 0 0 0 16 12V6c0-2.217-1.785-4.021-3.979-4.021-.07 0-.14.009-.209.025A4.006 4.006 0 0 0 8 6v.586L3.707 2.293 2.293 3.707l18 18 1.414-1.414zM6 12H4c0 4.072 3.06 7.436 7 7.931V22h2v-2.069a7.935 7.935 0 0 0 2.241-.63l-1.549-1.548A5.983 5.983 0 0 1 12 18c-3.309 0-6-2.691-6-6z"></path>
      <path d="M8.007 12.067a3.996 3.996 0 0 0 3.926 3.926l-3.926-3.926z"></path>
    </svg>
  );
}

export default MutedMicrophone;
