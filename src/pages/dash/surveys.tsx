import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Toast } from ".";

const Surveys = () => {
  const { data: sessionData } = useSession();

  if (!sessionData?.user?.id) {
    return (
      <Toast message={"Must be signed in to create survey"} type={"error"} />
    );
  }

  const { data } = api.user.getSurveysById.useQuery({
    id: sessionData.user.id,
  });
  console.log(data);

  return <div>surveys</div>;
};

export default Surveys;

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
