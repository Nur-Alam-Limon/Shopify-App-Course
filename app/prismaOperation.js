import prisma from "./db.server";


export async function findAllProducts() {
  return await prisma.product.findMany();
}

export async function ProductUpdate(id, name, price, description) {
  return await prisma.product.update({
    where: { id },
    data: { name, price, description },
  });
}

export async function ProductCreate(name, price, description) {
  return await prisma.product.create({
    data: { name, price, description },
  });
}
