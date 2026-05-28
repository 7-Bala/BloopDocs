import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import JSZip from "jszip";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const targetExt = formData.get("targetExt")?.toString().toLowerCase();
    
    if (!targetExt) {
      return NextResponse.json({ error: "Missing targetExt" }, { status: 400 });
    }

    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Generate a secure temporary directory for this conversion session
    const sessionId = Math.random().toString(36).substring(2, 15);
    const tmpDir = path.join(os.tmpdir(), `bloopdocs_engine_${sessionId}`);
    const inDir = path.join(tmpDir, "in");
    const outDir = path.join(tmpDir, "out");

    await fs.mkdir(inDir, { recursive: true });
    await fs.mkdir(outDir, { recursive: true });

    const zip = new JSZip();

    for (const file of files) {
      const originalName = file.name;
      // Sanitize filename to prevent shell injection or escaping issues
      const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const inPath = path.join(inDir, safeName);
      
      // Write incoming file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(inPath, buffer);

      try {
        // Automatically resolve LibreOffice binary path based on host OS (macOS vs Linux/Docker)
        const isMac = os.platform() === "darwin";
        const sofficePath = isMac 
          ? "/Applications/LibreOffice.app/Contents/MacOS/soffice" 
          : "soffice";
        
        // --env:UserInstallation ensures multiple parallel requests don't crash the single LibreOffice profile instance
        const profilePath = path.join(tmpDir, "profile");
        const command = `"${sofficePath}" -env:UserInstallation=file://${profilePath} --headless --convert-to ${targetExt} "${inPath}" --outdir "${outDir}"`;
        
        await execAsync(command);

        // Retrieve the generated authentic file
        const baseName = path.parse(safeName).name;
        const expectedOutFile = `${baseName}.${targetExt}`;
        const outPath = path.join(outDir, expectedOutFile);

        const outBuffer = await fs.readFile(outPath);
        
        // Append to the final ZIP archive with original formatting name
        const originalBase = path.parse(originalName).name;
        zip.file(`${originalBase}.${targetExt}`, outBuffer);

      } catch (convErr: any) {
        console.error(`Local engine failed for ${originalName}:`, convErr);
        // Gracefully handle un-convertable binaries by outputting an error log in the zip
        zip.file(`FAILED_${originalName}.txt`, `BloopDocs Engine Error:\nFailed to convert this file via LibreOffice.\n${convErr.message}`);
      }
    }

    // Compile the final ZIP
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });

    // Wipe the local session cache completely
    await fs.rm(tmpDir, { recursive: true, force: true });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="Converted_Documents.zip"',
      },
    });

  } catch (error: any) {
    console.error("BloopDocs API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
