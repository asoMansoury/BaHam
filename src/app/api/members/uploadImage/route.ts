import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addImageApi } from "@/app/actions/userActions";
import { apiAuth, apiTokenEmail } from "@/app/middleware/apiAuth";
import { getUserByEmail } from "@/app/actions/authActions";
import { generateUniqueFilename } from "@/app/utils/util";



export async function POST(request: NextRequest) {
    const authResponse = apiAuth(request); // Use the new middleware for token validation
    if (authResponse) return authResponse; // Return the response if token is invalid

    const email = apiTokenEmail(request);//Fetch email of requester
    const userData = await getUserByEmail(email); //Get details of user by email

    const body = await request.json();
    const {  base64Image } = body;

    if ( !base64Image) {
      return NextResponse.json(
        { error: "Missing userId or base64Image" },
        { status: 400 }
      );
    }

    // Extract image extension from base64 string
    const matches = base64Image.match(
      /^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/
    );
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: "Invalid base64 image format" },
        { status: 400 }
      );
    }

    const extension = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, "base64");


    // Define directory and file path
    const userDir = path.join(process.cwd(), "public", "images", "users", userData.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filename = generateUniqueFilename(extension);
    const filePath = path.join(userDir, filename);

    // Save the image file
    fs.writeFileSync(filePath, buffer);

    // Construct the URL relative to public folder
    const imageUrl = `/images/users/${userData.id}/${filename}`;

    // Save image info in DB using addImageApi
    await addImageApi(imageUrl, filename, userData.id);

    return NextResponse.json({ status: "success", imageUrl });
  
}
