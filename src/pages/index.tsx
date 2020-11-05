import { GetServerSideProps } from "next";
import { Header } from "../client/components/Header";
import {
  useCurrentUserQuery,
  useDummyMutation
} from "../client/gen/index";
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
      <Header />
     
    </main>
  );
};




function GraphqlExample() {
  const currentUserQuery = useCurrentUserQuery();
  const [dummy, result] = useDummyMutation();
  return (
    <div>
      <div>uid: {currentUserQuery.data?.currentUser?.id}</div>
      <button
        disabled={result.loading}
        onClick={async () => {
          const res = await dummy({ variables: {} });
          alert(res.data?.dummy?.error);
        }}
      >
        run command
      </button>
    </div>
  );
}

export default Index;
