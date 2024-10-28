import { RequestHandler } from "express";
import { supabase } from "../config/supabase";
import {
  ProductParams,
  CreateProductBody,
  UpdateProductBody,
} from "../types/product";
import { getPublicImageUrl, createImagePath } from "../utils/storageHelper";

const BUCKET_NAME = "disc-product-images";

class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

const uploadProductImage = async (
  imageFile: Express.Multer.File
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileExtension = imageFile.originalname.split(".").pop();
    const baseFileName = `${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExtension}`;
    const fullPath = createImagePath(baseFileName);
    console.log("Generated filename:", fullPath);

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, imageFile.buffer, {
        contentType: imageFile.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new FileUploadError(`Upload failed: ${uploadError.message}`);
    }

    console.log("Upload successful:", data);
    return fullPath;
  } catch (error) {
    console.error("Detailed upload error:", error);
    if (error instanceof Error) {
      throw new FileUploadError(error.message);
    }
    throw new FileUploadError("Unknown error occurred during file upload");
  }
};

const deleteProductImage = async (imageUrl: string) => {
  const fileName = imageUrl.split("/").pop();
  if (fileName) {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([createImagePath(fileName)]);

    if (error) {
      console.error("Error deleting image:", error);
    }
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    console.log("Starting product creation...");
    const { name, price, description } = req.body;
    const imageFile = req.file as Express.Multer.File;

    console.log("Request body:", { name, price, description });
    console.log("Image file received:", imageFile ? "yes" : "no");

    if (!name || !price) {
      res.status(400).json({ error: "Name and price are required" });
      return;
    }

    let image_url: string | null = null;
    if (imageFile) {
      try {
        console.log("Attempting to upload image...");
        const fileName = await uploadProductImage(imageFile);
        image_url = getPublicImageUrl(fileName);
        console.log("Image uploaded successfully:", image_url);
      } catch (error) {
        if (error instanceof FileUploadError) {
          res.status(500).json({
            error: "Failed to upload image",
            details: error.message,
          });
        } else {
          res.status(500).json({
            error: "Failed to upload image",
            details: "An unknown error occurred",
          });
        }
        return;
      }
    }

    console.log("Creating product in database...");
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price,
          description,
          image_url,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Product created successfully:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

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

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const imageFile = req.file as Express.Multer.File;

    if (!name && !price && !description && !imageFile) {
      res.status(400).json({ error: "At least one field must be provided" });
      return;
    }

    const { data: existingProduct } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    let image_url: string | undefined;
    if (imageFile) {
      const fileName = await uploadProductImage(imageFile);
      image_url = getPublicImageUrl(fileName);

      if (existingProduct?.image_url) {
        await deleteProductImage(existingProduct.image_url);
      }
    }

    const updateData: Partial<{
      name: string;
      price: number;
      description: string;
      image_url: string;
    }> = {
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
      ...(image_url && { image_url }),
    };

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
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

    const { data: product } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    if (product?.image_url) {
      await deleteProductImage(product.image_url);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
