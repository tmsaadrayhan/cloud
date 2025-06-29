"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const page = () => {
  const [folderOptions, setFolderOptions] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const auth = async () => {
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
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  useEffect(() => {
    auth();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
  });
  const handleChangeRadio = (event) => {
    setIsPublic(event.target.value === "true");
  };
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const fetchFolderNames = async () => {
    // Simulate fetching folder names from server or local storage
    try {
      const res = await axios.get("http://localhost:3000/folder");

      setFolderOptions(res.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  useEffect(() => {
    fetchFolderNames();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:3000/folder",
        {
          name: formData.name,
          public: isPublic,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      setUploadStatus(
        "Error uploading files: " + error.response?.data?.error || error.message
      );
    } finally {
      fetchFolderNames();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <label>
          <input
            type="radio"
            value="true"
            checked={isPublic}
            onChange={handleChangeRadio}
            name="visibility" // Name of the input group
          />
          Public
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={!isPublic}
            onChange={handleChangeRadio}
            name="visibility" // Name of the input group
          />
          Private
        </label>
        <button type="submit">Submit</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      <div>
        {folderOptions.map((folder) => (
          <div id={folder._id}>{folder.name}</div>
        ))}
      </div>
    </div>
  );
};

export default page;
