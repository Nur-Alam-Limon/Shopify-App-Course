import {
    Button,
    Card,
    FormLayout,
    TextField,
    Page,
    Layout,
    Text,
    BlockStack,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
  import { useEffect, useState } from "react";
  import { useLoaderData } from "@remix-run/react";
  
  // Loader function to fetch all products
  export let loader = async () => {
    // const products = await findAllProducts(); // Ensure calling the function
    return null; // Returning a plain object, loaderData will have a `products` property
  };
  
  // Action function to handle product creation or updating
  export let action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    // const name = formData.get("name");
    // const price = parseFloat(formData.get("price") || "0");
    // const description = formData.get("description");
    // const id = parseInt(formData.get("id") || "0");
  
    // if (id) {
    //   await ProductUpdate(id, name, price, description);
    // } else {
    //   await ProductCreate(name, price, description);
    // }
  
    return null; // Redirect or re-fetch if necessary
  };
  
  export default function ProductsPage() {
    const loaderData = useLoaderData();
    const [products, setProducts] = useState(loaderData.products);
  
    // New state for form fields
    const [productData, setProductData] = useState({
      id: '',
      name: '',
      price: '',
      description: '',
    });
  
    useEffect(() => {
      setProducts(loaderData.products); // Set products from loader data
    }, [loaderData]);
  
    // Update productData on field change
    const handleInputChange = (name, value) => {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value, // Dynamically update the field
      }));
    };
  
    // Set form data for updating product
    const handleUpdateClick = (product) => {
      setProductData({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      });
    };
  
    return (
      <Page>
        <TitleBar title="Product Management" />
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Create or Update a Product
                </Text>
                <form method="post">
                  <FormLayout>
                    <TextField
                      label="Product Name"
                      name="name"
                      value={productData.name}
                      onChange={(value) => handleInputChange('name', value)} // Update directly
                      required
                    />
                    <TextField
                      label="Price"
                      name="price"
                      type="number"
                      value={productData.price}
                      onChange={(value) => handleInputChange('price', value)} // Update directly
                      required
                    />
                    <TextField
                      label="Description"
                      name="description"
                      value={productData.description}
                      onChange={(value) => handleInputChange('description', value)} // Update directly
                    />
                    <input type="hidden" name="id" value={productData.id} />
                    <Button submit>Save Product</Button>
                  </FormLayout>
                </form>
              </BlockStack>
            </Card>
          </Layout.Section>
  
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Product List
                </Text>
                <ul>
                  {/* Render products */}
                  {products && products.map((product) => (
                    <li key={product.id}>
                      <Text variant="bodyMd">
                        {product.name} - ${product.price}
                      </Text>
                      <Button onClick={() => handleUpdateClick(product)}>Update</Button>
                    </li>
                  ))}
                </ul>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  