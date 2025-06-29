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
          `http://localhost:3000/users/${localStorage.getItem("user")}`,
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
    <div>
      <Link href="/">Home</Link>
      <button onClick={() => privateRoute("/upload")}>upload files</button>
      <button onClick={() => privateRoute("/create-folder")}>
        Create Folder
      </button>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default Header;
