"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Upload = () => {
  const router = useRouter();
  const auth = async () => {
    try {
      if(localStorage.getItem("user")){
        const response = await axios.get(
          `https://cloud-backup-1oyf.vercel.app/users/${localStorage.getItem("user")}`,
          {
            headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log(response.data);
        if (!response.data.isAdmin) {
          router.push("/login");
        }
      }
      else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  useEffect(()=> {
    auth();
  },[])
  const [folderOptions, setFolderOptions] = useState([]); // Array to hold folder names
  const [selectedFolder, setSelectedFolder] = useState(""); // Selected folder name
  const [radioValue, setRadioValue] = useState("private");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Function to fetch folder names (replace with your actual logic to get folder names)
  const fetchFolderNames = async () => {
    // Simulate fetching folder names from server or local storage
    try {
      const res = await axios.get("https://cloud-backup-1oyf.vercel.app/folder");

      setFolderOptions(res.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    fetchFolderNames(); // Fetch folder names on component mount
  }, []); // Empty dependency array ensures fetching happens only once

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.value);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFiles) {
      setUploadStatus("No files selected");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const responseCloudinary = await axios.post(
        "https://cloud-backup-1oyf.vercel.app/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log({
        files: responseCloudinary.data,
        folder: selectedFolder,
        public: radioValue,
      });
      const response = await axios.post(
        "https://cloud-backup-1oyf.vercel.app/file",
        {
          files: responseCloudinary.data,
          folder: selectedFolder,
          public: radioValue === "public" ? true : false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      setUploadStatus(
        "Error uploading files: " + error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="files">Select Files:</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="folderName">Select Folder:</label>
          <select
            className="bg-[#121212] text-[#FFFFFF] border"
            id="folderName"
            value={selectedFolder}
            onChange={handleFolderChange}
          >
            <option value="">-- Select Folder --</option>
            {folderOptions.map((folder) => (
              <option
                className="bg-[#121212] text-[#FFFFFF]"
                key={folder}
                value={folder._id}
              >
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Option:</label>
          <div>
            <input
              type="radio"
              id="public"
              name="radioGroup"
              value="public"
              checked={radioValue === "public"}
              onChange={handleRadioChange}
            />
            <label htmlFor="public">Public</label>
          </div>
          <div>
            <input
              type="radio"
              id="private"
              name="radioGroup"
              value="private"
              checked={radioValue === "private"}
              onChange={handleRadioChange}
            />
            <label htmlFor="private">Private</label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default Upload;
