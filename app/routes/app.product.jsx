import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  Box,
  InlineStack,
} from "@shopify/polaris";
import { useEffect, useState } from "react";

// Load latest products
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 5) {
        edges {
          node {
            id
            title
            status
          }
        }
      }
    }
  `);

  const json = await response.json();
  const products = json.data.products.edges.map((edge) => edge.node);

  return { products };
}

// Create product
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = formData.get("title");

  const response = await admin.graphql(
    `#graphql
  mutation {
    productCreate(product: {title: "Cool socks", productOptions: [{name: "Color", values: [{name: "Red"}, {name: "Blue"}]}, {name: "Size", values: [{name: "Small"}, {name: "Large"}]}]}) {
      product {
        id
        title
        options {
          id
          name
          position
          optionValues {
            id
            name
            hasVariants
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`
  );

  const data = await response.json();

  console.log("data", data.data.productCreate);

  return { success: true, createdTitle: data.data.productCreate.product.title };
}


export default function ProductRoute() {
  const { products } = useLoaderData();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (fetcher.data?.success) {
      setTitle(""); 
    }
  }, [fetcher.data]);

  return (
    <Page>
      <TitleBar title="Product Management" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <fetcher.Form method="post">
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Create Product
                  </Text>
                  <TextField
                    label="Product Title"
                    value={title}
                    onChange={setTitle}
                    name="title"
                    placeholder="Enter product name"
                    autoComplete="off"
                  />
                  <Button submit primary loading={isSubmitting}>
                    Create Product
                  </Button>
                  {fetcher.data?.createdTitle && (
                    <Box padding="300" background="bg-surface-secondary">
                      <Text variant="bodyMd">
                        ✅ Created: {fetcher.data.createdTitle}
                      </Text>
                    </Box>
                  )}
                </BlockStack>
              </fetcher.Form>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Latest Products
                </Text>
                {products.map((product) => (
                  <Box
                    key={product.id}
                    padding="200"
                    borderWidth="025"
                    borderRadius="100"
                  >
                    <InlineStack align="space-between">
                      <Text>{product.title}</Text>
                      <Text tone="subdued">{product.status}</Text>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
