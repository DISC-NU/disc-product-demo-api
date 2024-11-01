import { supabase } from "../config/supabase";
import { dummyData } from "../data/dummyData";
import { getPublicImageUrl } from "../utils/storageHelper";

const resetDatabase = async () => {
  try {
    console.log("Starting database reset...");

    console.log("Ensuring products table exists...");
    await supabase.from("products").select("id").limit(1);

    console.log("Processing products with image URLs...");
    const productsWithImages = dummyData.map((product) => {
      const imageName = product.image_url.split("/").pop()!;
      return {
        ...product,
        image_url: getPublicImageUrl(imageName),
      };
    });

    console.log("Deleting existing products...");
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .neq("id", 0);

    if (deleteError) throw deleteError;

    console.log("Inserting products with image URLs...");
    const { data, error: insertError } = await supabase
      .from("products")
      .insert(productsWithImages)
      .select();

    if (insertError) throw insertError;

    console.log("Database reset successful!");
    console.log("Inserted products:", data);
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    process.exit();
  }
};

resetDatabase();
