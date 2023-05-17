import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../server/auth";

const Dash = () => {
  return (
    <div>
      <h1 className="text-2xl">Create Survey</h1>
      {/* Add Button to add question component, Maybe use local state to handle that? */}
      <button className="btn-secondary btn">Save & Submit </button>
    </div>
  );
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
