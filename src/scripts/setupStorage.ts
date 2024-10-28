import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const BUCKET_NAME = "disc-product-images";
const IMAGES_DIR = path.join(__dirname, "../images");

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupStorage() {
  try {
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      const { error: createError } = await supabaseAdmin.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2,
        }
      );

      if (createError) {
        throw new Error(`Error creating bucket: ${createError.message}`);
      }
      console.log("Bucket created successfully!");
    } else {
      console.log("Bucket already exists, skipping creation.");
    }

    const files = fs.readdirSync(IMAGES_DIR);
    console.log(`Found ${files.length} files to upload`);

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const filePath = path.join(IMAGES_DIR, file);
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading: ${file}`);
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(`product-images/${file}`, fileBuffer, {
            contentType: `image/${path.extname(file).substring(1)}`,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Error uploading ${file}:`, uploadError);
        } else {
          console.log(`Successfully uploaded: ${file}`);
        }
      }
    }

    const utilsDir = path.join(__dirname, "../utils");
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir);
    }

    console.log("\nUpdating public URL helper function...");
    const helperCode = `
import { supabase } from '../config/supabaseClient';

export const getPublicImageUrl = (imageName: string): string => {
  const { data } = supabase.storage
    .from("${BUCKET_NAME}")
    .getPublicUrl(\`product-images/\${imageName}\`);
  return data.publicUrl;
};`;

    fs.writeFileSync(
      path.join(utilsDir, "storageHelper.ts"),
      helperCode,
      "utf-8"
    );

    console.log("Storage setup completed successfully!");
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

setupStorage();
