import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";

const Home: NextPage = ({
  host,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div>
    Hello from {host}
    <div>
      <Link href={"/blogposts"}>Blogposts</Link>
    </div>
  </div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      host: ctx.req.headers.host,
    },
  };
};

export default Home;