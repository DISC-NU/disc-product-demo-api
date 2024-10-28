import { RequestHandler } from "express";
import { supabase } from "../config/supabase";
import {
  ProductParams,
  CreateProductBody,
  UpdateProductBody,
} from "../types/product";

export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.log("Error fetching products", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById: RequestHandler<ProductParams> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct: RequestHandler<{}, {}, CreateProductBody> = async (
  req,
  res
) => {
  try {
    const { name, price, description } = req.body;

    // Basic validation
    if (!name || !price) {
      res.status(400).json({ error: "Name and price are required" });
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price, description }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct: RequestHandler<
  ProductParams,
  {},
  UpdateProductBody
> = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    // Check if at least one field is provided
    if (!name && !price && !description) {
      res.status(400).json({ error: "At least one field must be provided" });
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .update({ name, price, description })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct: RequestHandler<ProductParams> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
