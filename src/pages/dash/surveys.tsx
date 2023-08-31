import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Surveys = () => {
  const { data: sessionData } = useSession();

  if (!sessionData?.user?.id) {
    return <h1>Not authorized</h1>;
  }
  const ctx = api.useContext();

  const { data, isLoading } = api.survey.getSurveysById.useQuery({
    id: sessionData.user.id,
  });

  const { mutate } = api.survey.updateIsActiveById.useMutation({
    onSuccess: () => {
      void ctx.survey.getSurveysById.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0)
    return (
      <div className="mt-9">
        <Link href="/dash" className="link-primary link text-4xl">
          You have no surveys, create one
        </Link>
      </div>
    );

  return (
    <div className="overflow-x-auto overflow-y-auto  py-10">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>title</th>
            <th>questions</th>
            <th>responses</th>
            <th>active</th>
            <th>view survey</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, title, question, isActive, responses }, index) => (
            <tr key={id}>
              <th>{index + 1}</th>
              <td key={id} className="capitalize">
                {title}
              </td>
              <td className="text-center">{question.length}</td>
              <td className="text-center">{responses}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={!!isActive}
                  className="checkbox"
                  onChange={() => mutate({ id, isActive: !isActive })}
                />
              </td>
              <td>
                <Link href={`/survey/${id}`} target="_blank">
                  Survey link
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
