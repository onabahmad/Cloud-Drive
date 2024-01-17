import React, { useState, useEffect } from "react";
import { storage } from "../../firebase";
import Navbar from "../Navbar/Navbar";
import {
  uploadBytes,
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FaRegFileLines } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Home.css";

const Home = () => {
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleClick = async () => {
    if (file !== null) {
      const fileName = file.name;
      const uploadfile = ref(storage, `files/${fileName}`);

      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            setUploading(true);
            resolve();
          }, 2000);
        });

        await uploadBytes(uploadfile, file);
        console.log("File uploaded successfully!");
        getDownloadURL(uploadfile).then((url) => {
          setPreview((data) => [...data, url]);
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    } else {
      alert("File not found");
    }
  };

  useEffect(() => {
    listAll(ref(storage, "files"))
      .then((file) => {
        const promises = file.items.map((val) => getDownloadURL(val));
        return Promise.all(promises);
      })
      .then((urls) => {
        setPreview(urls);
      })
      .catch((error) => {
        console.error("Error fetching existing files:", error);
      });
  }, []);

  const getFileName = (url) => {
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.lastIndexOf("/") + 1;
    const endIndex = decodedUrl.indexOf("?");
    return endIndex !== -1
      ? decodedUrl.substring(startIndex, endIndex)
      : decodedUrl.substring(startIndex);
  };

  const handleDelete = async (url) => {
    try {
      const fileRef = ref(storage, `files/${getFileName(url)}`);
      await deleteObject(fileRef);
      setPreview((prevPreview) =>
        prevPreview.filter((prevUrl) => prevUrl !== url)
      );
      console.log("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const filteredPreview = preview.filter((url) =>
    getFileName(url).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div>
        <Navbar />
      </div>
      <div className="search-upload-container">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoIosSearch />
        </div>
        <div className="upload-file-button">
          <label class="custom-file-upload">
            <span>
              <MdAdd />
            </span>
            New
            <input
              className="file-input"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </label>
          {file && !uploading && (
            <button className="upload-button" onClick={handleClick}>
              <MdFileUpload />
              Upload
            </button>
          )}
          {uploading && (
            <button className="upload-button" disabled>
              <MdFileUpload />
              Uploading...
            </button>
          )}
        </div>
      </div>
      <div className="file-preview-container">
        {filteredPreview.map((dataVal, index) => (
          <div key={index} className="file-item">
            <p className="file-name">{getFileName(dataVal)}</p>
            {dataVal.includes(".png") || dataVal.includes(".jpg") ? (
              <img className="file-preview" src={dataVal} alt="" />
            ) : (
              <a
                className="file-link"
                href={dataVal}
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
                <FaRegFileLines />
              </a>
            )}
            <button
              className="delete-button"
              onClick={() => handleDelete(dataVal)}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
