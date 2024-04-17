import React from "react";
import VerifyOTP from "./VerifyOtp";
import { createBrowserHistory } from "history";

function ParentComponent() {
  const history = createBrowserHistory();

  return (
    <div>
      {/* Other components */}
      <VerifyOTP history={history} />
    </div>
  );
}

export default ParentComponent;
