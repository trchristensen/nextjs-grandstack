import gql from "graphql-tag";

export const FLAVOR_QUERY = gql`
query flavorQuery($flavorId: ID, $first: Int, $offset: Int ) {
  Flavor(flavorId: $flavorId, first: $first, offset: $offset) {
    flavorId
    name
    description
    company {
      companyId
      name
      website
    }
    tags {
      tagId
      name
    }
  }
}
`

export const FLAVORS = gql`
  query Flavors {
    Flavor {
      name
      flavorId
    }
  }
`;