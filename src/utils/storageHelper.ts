import { supabase } from "../config/supabase";

export const getPublicImageUrl = (imageName: string): string => {
  const { data } = supabase.storage
    .from("disc-product-images")
    .getPublicUrl(imageName);
  return data.publicUrl;
};

export const createImagePath = (filename: string): string => {
  return `product-images/${filename}`;
};
