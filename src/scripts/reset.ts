import { supabase } from "../config/supabase";
import { Product } from "../types/product";
import { dummyData } from "../data/dummyData";

const resetDatabase = async () => {
  try {
    console.log("Deleting existing products...");
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .neq("id", 0);

    if (deleteError) throw deleteError;

    console.log("Inserting dummy products...");
    const { data, error: insertError } = await supabase
      .from("products")
      .insert(dummyData)
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
