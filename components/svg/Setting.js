import React from "react";

function Settings() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 39 39"
    >
      <path fill="url(#pattern0)" d="M0 0H39V39H0z"></path>
      <defs>
        <pattern
          id="pattern0"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00195)" xlinkHref="#image0_2_83"></use>
        </pattern>
        <image
          id="image0_2_83"
          width="512"
          height="512"
          xlinkHref="data:image/png;base64,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"
        ></image>
      </defs>
    </svg>
  );
}

export default Settings;