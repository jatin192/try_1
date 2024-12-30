import { ReactNode, useState } from "react";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

interface AnonAadhaarContextProps {
  children: ReactNode;
}

export function AnonAadhaarContext({ children }: AnonAadhaarContextProps) {
  const [useTestAadhaar, setUseTestAadhaar] = useState<boolean>(false);

  return (
    <AnonAadhaarProvider
      _useTestAadhaar={useTestAadhaar}
      _appName="Anon Aadhaar Template"
    >
      {children}
    </AnonAadhaarProvider>
  );
}
