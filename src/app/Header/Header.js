"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const privateRoute = async (uri) => {
    try {
      if (localStorage.getItem("user")) {
        const response = await axios.get(
          `https://cloud-backup-1oyf.vercel.app/users/${localStorage.getItem(
            "user"
          )}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        if (!response.data.isAdmin) {
          router.push("/login");
        } else {
          router.push(uri);
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  return (
    <div className="my-1">
      <Link href="/">Home</Link>
      <button className="mx-2" onClick={() => privateRoute("/upload")}>
        Upload Files
      </button>
      <button className="mx-2" onClick={() => privateRoute("/gallery")}>
        Gallery
      </button>
      <button className="mx-2" onClick={() => privateRoute("/create-folder")}>
        Create Folder
      </button>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default Header;
