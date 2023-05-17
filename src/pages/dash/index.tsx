import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../server/auth";

const Dash = () => {
  return <div className="">dash</div>;
};

export default Dash;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
