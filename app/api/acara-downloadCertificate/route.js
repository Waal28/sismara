import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getImage } from '@/constants';
// import { handleResponse } from '../../route';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parsing body request
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ message: 'fileName is required' }, { status: 400 });
    }

    // URL gambar
    const imageUrl = getImage(fileName); // Pastikan fungsi `getImage` tersedia

    // Path tempat menyimpan file
    const filePath = path.join(process.cwd(), 'public', 'certificate', fileName);

    // Periksa apakah file sudah ada
    if (fs.existsSync(filePath)) {
      return NextResponse.json({
        status: "success",
        message: 'Image already exists',
        data: fileName
      }, { status: 200 });
    }

    // Unduh gambar
    const response = await axios.get(imageUrl, { responseType: 'stream' });

    // Simpan gambar ke `public/certificate`
    const writer = fs.createWriteStream(filePath);

    // Tunggu hingga selesai menulis
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return NextResponse.json({
      status: "success",
      message: 'Image downloaded successfully!',
      data: fileName,
     }, { status: 200 });
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json({
      status: "failed",
      message: 'Failed to download the image',
      data: error.message,
    }, { status: 500 });
  }
}