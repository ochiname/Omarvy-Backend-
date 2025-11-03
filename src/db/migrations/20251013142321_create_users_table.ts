import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // USERS
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("full_name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password").notNullable();
    table.enu("role", ["customer", "admin"]).notNullable().defaultTo("customer");
    table.string("phone", 20);
    table.text("address");
    table.timestamps(true, true);
  });

  // CATEGORIES
  await knex.schema.createTable("categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 100).notNullable().unique();
    table.text("description");
    table.timestamps(true, true);
  });

  // PRODUCTS
  await knex.schema.createTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 150).notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable();
    table.integer("stock_quantity").notNullable().defaultTo(0);
    table.uuid("category_id").references("id").inTable("categories").onDelete("SET NULL");
    table.text("image_url");
    table.timestamps(true, true);
  });

  // CARTS
  await knex.schema.createTable("carts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.timestamps(true, true);
  });

  // CART ITEMS
  await knex.schema.createTable("cart_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("cart_id").references("id").inTable("carts").onDelete("CASCADE");
    table.uuid("product_id").references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price", 10, 2).notNullable();
    table.decimal("subtotal", 10, 2).notNullable();
  });

  // ORDERS
  await knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.decimal("total_amount", 10, 2).notNullable();
    table.enu("payment_status", ["pending", "paid", "failed", "refunded"]).defaultTo("pending");
    table.enu("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]).defaultTo("pending");
    table.string("payment_reference", 255);
    table.timestamps(true, true);
  });

  // ORDER ITEMS
  await knex.schema.createTable("order_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.uuid("product_id").references("id").inTable("products").onDelete("SET NULL");
    table.integer("quantity").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.decimal("subtotal", 10, 2).notNullable();
  });
   

  // Delivery Fees
  await knex.schema.createTable("delivery_fees", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("location").notNullable();
    table.decimal("fee", 10, 2).notNullable();
    table.timestamps(true, true); // created_at & updated_at with defaults
  });

  // PAYMENTS
  await
   knex.schema.createTable("payments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.uuid("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.decimal("amount", 10, 2).notNullable();
    table.enu("provider", ["paystack", "flutterwave", "stripe", "paypal"]).notNullable();
    table.string("payment_reference", 255).notNullable();
    table.enu("status", ["success", "failed", "pending"]).defaultTo("pending");
    table.timestamp("paid_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("payments")
    .dropTableIfExists("order_items")
    .dropTableIfExists("orders")
    .dropTableIfExists("cart_items")
    .dropTableIfExists("carts")
    .dropTableIfExists("products")
    .dropTableIfExists("categories")
    .dropTableIfExists("users");
}
