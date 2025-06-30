'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

function groupImagesByDate(images) {
  return images.reduce((acc, img) => {
    const dateKey = new Date(img.date).toISOString().split('T')[0]; // YYYY-MM-DD
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(img);
    return acc;
  }, {});
}

export default function GalleryPage() {
  const [imagesByDate, setImagesByDate] = useState({});

  useEffect(() => {
    axios.get('https://cloud-backup-1oyf.vercel.app/file')
      .then((res) => {
        const grouped = groupImagesByDate(res.data);
        setImagesByDate(grouped);
      })
      .catch((err) => {
        console.error('Error fetching images:', err);
      });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      {Object.entries(imagesByDate).map(([date, images]) => (
        <div key={date} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{date}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} className="overflow-hidden rounded shadow">
                <img
                  src={img.uri}
                  alt={img.public_id}
                  className="w-full h-48 object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
