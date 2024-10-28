import { Product } from "../types/product";

export const dummyData: Omit<Product, "id" | "created_at">[] = [
  {
    name: "Classic Milk Tea",
    price: 5.99,
    description:
      "Traditional black tea with non-dairy creamer and brown sugar boba pearls",
    image_url: "../images/classic-milk-tea.jpeg",
  },
  {
    name: "Taro Milk Tea",
    price: 6.49,
    description: "Creamy taro root powder with milk and black boba pearls",
    image_url: "../images/taro-milk-tea.jpg",
  },
  {
    name: "Brown Sugar Boba Latte",
    price: 6.99,
    description: "Fresh milk with brown sugar syrup and warm boba pearls",
    image_url: "../images/brown-sugar-milk-tea.jpg",
  },
  {
    name: "Matcha Green Tea Latte",
    price: 6.49,
    description: "Premium Japanese matcha powder with milk and green tea jelly",
    image_url: "../images/matcha-green-tea-latte.jpg",
  },
  {
    name: "Thai Tea",
    price: 5.99,
    description: "Strong Thai tea blend with condensed milk and honey boba",
    image_url: "../images/thai-tea.jpeg",
  },
  {
    name: "Mango Green Tea",
    price: 5.99,
    description: "Jasmine green tea with fresh mango puree and popping boba",
    image_url: "../images/mango-green-tea.jpg",
  },
  {
    name: "Honey Lemon Green Tea",
    price: 5.49,
    description: "Green tea with honey, fresh lemon and white pearls",
    image_url: "../images/honey-green-lemon.jpeg",
  },
  {
    name: "Strawberry Milk",
    price: 6.49,
    description: "Fresh milk with strawberry puree and crystal boba",
    image_url: "../images/strawberry-milk-tea.jpg",
  },
  {
    name: "Oolong Milk Tea",
    price: 5.99,
    description: "Premium oolong tea with cream and traditional boba pearls",
    image_url: "../images/oolong-milk-tea.jpeg",
  },
  {
    name: "Coffee Milk Tea",
    price: 6.99,
    description: "House-blend coffee with milk tea and coffee jelly",
    image_url: "../images/coffee-milk-tea.jpeg",
  },
];
