import { SessionProvider } from "next-auth/react";
import DashLayout from "~/components/layouts/DashLayout";
import { useRouter } from "next/router";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { pathname } = useRouter();
  return (
    <SessionProvider session={session}>
      {pathname === "/dash" ? (
        <DashLayout>
          <Component {...pageProps} />
        </DashLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
