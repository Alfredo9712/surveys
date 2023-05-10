import { SessionProvider } from "next-auth/react";
import DashLayout from "~/components/layouts/DashLayout";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DashLayout>
        <Component {...pageProps} />
      </DashLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
