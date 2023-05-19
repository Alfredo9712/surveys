import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { MdAddBox } from "react-icons/md";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

import type { GetServerSidePropsContext } from "next";
import type { Question } from "prisma/prisma-client";

const Dash = () => {
  const { data: sessionData } = useSession();

  //RouterOutputs to get type of the surveys

  const questions = useState<Question[]>();

  return (
    <div className="flex h-full flex-col bg-slate-300">
      <h1 className="mb-2 text-2xl">Create Survey</h1>
      <div className="mb-5">
        <p className="mb-1 text-sm">
          Click below to add a question to your survey
        </p>
        <MdAddBox size={30} style={{ cursor: "pointer" }} />
      </div>
      {/* Add funciontality/question component, Maybe use local state to handle that before submitting the api? */}
      <button className="btn-secondary btn mt-auto max-w-xs ">
        Save & Submit{" "}
      </button>
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
