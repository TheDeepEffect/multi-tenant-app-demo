import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import React from "react";
import prisma from "../../lib/prisma";

const Home: NextPage = ({
  blogposts,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1>These are the blogposts</h1>
          <ol>
            {React.Children.toArray(
              blogposts?.map((blogpost: any) => {
                /* Code to render the blogposts */
                return <li>{blogpost.title}</li>;
              })
            )}
          </ol>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // auth validation can be added here
  const selectedDomain = await prisma?.domain.findUnique({
    where: {
      domain: ctx.req.headers.host,
    },
  });
  if (!selectedDomain) {
    return {
      props: {
        error: "The domain was not registered in the app",
      },
    };
  }
console.log({selectedDomain});

  const blogposts = await prisma?.blogpost.findMany({
    include:{
        organization:{
            select:{
                domain:{
                    select:{
                        domain:true
                    }
                }
            }
        }
    }
  });

  return {
    props: {
      blogposts: JSON.parse(JSON.stringify(
        blogposts.filter(x=>x.organization.domain.some(x=>x.domain===selectedDomain.domain))
      )) || [],
    },
  };
};

export default Home;
