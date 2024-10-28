import { supabase } from "../config/supabase";

export const getPublicImageUrl = (imageName: string): string => {
  const { data } = supabase.storage
    .from("disc-product-images")
    .getPublicUrl(`product-images/${imageName}`);
  return data.publicUrl;
};
