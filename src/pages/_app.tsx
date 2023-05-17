import { SessionProvider } from "next-auth/react";
import DashLayout from "~/components/layouts/DashLayout";
import { useRouter } from "next/router";
import { Lato } from "next/font/google";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { pathname } = useRouter();
  return (
    <SessionProvider session={session}>
      {pathname.includes("/dash") ? (
        <main className={lato.className}>
          <DashLayout>
            <Component {...pageProps} />
          </DashLayout>
        </main>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
