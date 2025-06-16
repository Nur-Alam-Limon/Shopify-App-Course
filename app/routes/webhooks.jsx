import { authenticate } from "../shopify.server"

export const action = async ({request})=>{
    const { topic, shop, payload, session } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook`, payload);

    switch(topic){
        case "PRODUCTS_UPDATE":
            console.log("Product Updated")
            break;
        case "APP_UNINSTALLED":
            console.log("Product Updated")
            break;
    }

    return new Response("Webhook processed", {status: 200});
}