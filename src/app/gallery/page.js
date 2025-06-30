'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

function groupImagesByDate(images) {
  return images.reduce((acc, img) => {
    const dateKey = new Date(img.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(img);
    return acc;
  }, {});
}

export default function GalleryPage() {
  const [imagesByDate, setImagesByDate] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = async (pageNum) => {
    try {
      const res = await axios.get(`https://cloud-backup-1oyf.vercel.app/file?page=${pageNum}&limit=12`);
      const grouped = groupImagesByDate(res.data.data);
      setImagesByDate(grouped);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

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

      <div className="flex justify-center space-x-4 mt-10">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="btn">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="btn">Next</button>
      </div>
    </main>
  );
}
