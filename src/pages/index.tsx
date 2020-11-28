import { GetServerSideProps } from "next";
// import { Header } from "../client/components/Header";
// import {
//   useCurrentUserQuery,
//   useDummyMutation
// } from "../client/gen/index";
// import { GraphQLBoolean } from "graphql";



type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log(ctx)
  return {
    props: {},
  };
};

const Index = () => {

  return (
    <main>
    </main>
  );
};





export default Index;
