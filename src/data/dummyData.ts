import { Product } from "../types/product";

export const dummyData: Omit<Product, "id" | "created_at">[] = [
  {
    name: "Classic Milk Tea",
    price: 5.99,
    description:
      "Traditional black tea with non-dairy creamer and brown sugar boba pearls",
  },
  {
    name: "Taro Milk Tea",
    price: 6.49,
    description: "Creamy taro root powder with milk and black boba pearls",
  },
  {
    name: "Brown Sugar Boba Latte",
    price: 6.99,
    description: "Fresh milk with brown sugar syrup and warm boba pearls",
  },
  {
    name: "Matcha Green Tea Latte",
    price: 6.49,
    description: "Premium Japanese matcha powder with milk and green tea jelly",
  },
  {
    name: "Thai Tea",
    price: 5.99,
    description: "Strong Thai tea blend with condensed milk and honey boba",
  },
  {
    name: "Mango Green Tea",
    price: 5.99,
    description: "Jasmine green tea with fresh mango puree and popping boba",
  },
  {
    name: "Honey Lemon Green Tea",
    price: 5.49,
    description: "Green tea with honey, fresh lemon and white pearls",
  },
  {
    name: "Strawberry Milk",
    price: 6.49,
    description: "Fresh milk with strawberry puree and crystal boba",
  },
  {
    name: "Oolong Milk Tea",
    price: 5.99,
    description: "Premium oolong tea with cream and traditional boba pearls",
  },
  {
    name: "Coffee Milk Tea",
    price: 6.99,
    description: "House-blend coffee with milk tea and coffee jelly",
  },
];
