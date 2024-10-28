import { supabase } from "../config/supabase";

const BUCKET_NAME = "disc-product-images";

export const getPublicImageUrl = (imageName: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`product-images/${imageName}`);
  return data.publicUrl;
};
