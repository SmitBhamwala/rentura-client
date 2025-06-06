"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>
          {children}
          </Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
}
