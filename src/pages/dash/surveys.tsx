import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";

const surveys = () => {
  return <div>surveys</div>;
};

export default surveys;

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
