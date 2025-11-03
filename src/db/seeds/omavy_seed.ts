import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 🔹 Clear existing data (order matters due to foreign keys)
  await knex("payments").del();
  await knex("order_items").del();
  await knex("orders").del();
  await knex("cart_items").del();
  await knex("carts").del();
  await knex("products").del();
  await knex("categories").del();
  await knex("users").del();

  // ------------------------------------------------------------
  // USERS
  // ------------------------------------------------------------
  const [adminUser, customerUser] = await knex("users")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        full_name: "Admin User",
        email: "admin@omavy.com",
        password: "hashed_admin_password", // hash in real app
        role: "admin",
        phone: "+2348100000001",
        address: "Omavy HQ, Lagos, Nigeria",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        full_name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "hashed_customer_password",
        role: "customer",
        phone: "+2348100000002",
        address: "23 Broad Street, Abuja, Nigeria",
      },
    ])
    .returning("*");

  // ------------------------------------------------------------
  // CATEGORIES
  // ------------------------------------------------------------
  const [electronics, fashion, groceries] = await knex("categories")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Electronics",
        description: "Devices and gadgets such as phones, laptops, and accessories.",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Fashion",
        description: "Clothing, shoes, and accessories for all genders.",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Groceries",
        description: "Everyday essential items and food products.",
      },
    ])
    .returning("*");

  // ------------------------------------------------------------
  // PRODUCTS
  // ------------------------------------------------------------
  const [phone, laptop, tshirt, rice] = await knex("products")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Samsung Galaxy S23",
        description: "Latest Samsung smartphone with 256GB storage.",
        price: 350000,
        stock_quantity: 10,
        category_id: electronics.id,
        image_url: "https://example.com/images/s23.jpg",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "HP Pavilion 15",
        description: "Intel Core i7 laptop with 16GB RAM.",
        price: 600000,
        stock_quantity: 8,
        category_id: electronics.id,
        image_url: "https://example.com/images/hp-pavilion.jpg",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Men's T-Shirt",
        description: "Cotton T-shirt available in multiple colors.",
        price: 7000,
        stock_quantity: 50,
        category_id: fashion.id,
        image_url: "https://example.com/images/tshirt.jpg",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Bag of Rice (50kg)",
        description: "Premium Nigerian rice, 50kg bag.",
        price: 45000,
        stock_quantity: 20,
        category_id: groceries.id,
        image_url: "https://example.com/images/rice.jpg",
      },
    ])
    .returning("*");

  // ------------------------------------------------------------
  // CARTS
  // ------------------------------------------------------------
  const [janeCart] = await knex("carts")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        user_id: customerUser.id,
      },
    ])
    .returning("*");

  // ------------------------------------------------------------
  // CART ITEMS
  // ------------------------------------------------------------
  await knex("cart_items").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      cart_id: janeCart.id,
      product_id: phone.id,
      quantity: 1,
      price: phone.price,
      subtotal: phone.price,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      cart_id: janeCart.id,
      product_id: tshirt.id,
      quantity: 2,
      price: tshirt.price,
      subtotal: tshirt.price * 2,
    },
  ]);

  // ------------------------------------------------------------
  // ORDERS
  // ------------------------------------------------------------
  const totalOrderAmount = phone.price + tshirt.price * 2;

  const [order] = await knex("orders")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        user_id: customerUser.id,
        total_amount: totalOrderAmount,
        payment_status: "paid",
        order_status: "delivered",
        payment_reference: "PAY-REF-20251013-001",
      },
    ])
    .returning("*");

  // ------------------------------------------------------------
  // ORDER ITEMS
  // ------------------------------------------------------------
  await knex("order_items").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      order_id: order.id,
      product_id: phone.id,
      quantity: 1,
      price: phone.price,
      subtotal: phone.price,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      order_id: order.id,
      product_id: tshirt.id,
      quantity: 2,
      price: tshirt.price,
      subtotal: tshirt.price * 2,
    },
  ]);

  // ------------------------------------------------------------
  // PAYMENTS
  // ------------------------------------------------------------
  await knex("payments").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: customerUser.id,
      order_id: order.id,
      amount: totalOrderAmount,
      provider: "paystack",
      payment_reference: "PAY-REF-20251013-001",
      status: "success",
      paid_at: knex.fn.now(),
    },
  ]);
}
