import axios from "axios";
import React, { useContext, useState } from "react";
import SideBar from "../../components/sidebar/SideBar";
import { Context } from "../../context/Context";
import "./settings.css";

const Settings = () => {
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const PF = "http://localhost:4000/images/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
    };
    if (file) {
      const data = new FormData();
      const regex = /\s|\(|\)/g;
      const formattedName = file.name.replace(regex, "_");
      data.append("name", formattedName);
      data.append("file", file);
      updatedUser.profilePic = formattedName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const res = await axios.put(`/users/${user._id}`, updatedUser);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      dispatch({ type: "UPDATE_FAILURE" });
      console.log(error);
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              alt="pp"
              src={
                file
                  ? URL.createObjectURL(file)
                  : user.profilePic
                  ? PF + user.profilePic
                  : "https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg"
              }
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "10px" }}
            >
              Profile has been updated
            </span>
          )}
        </form>
      </div>
      <SideBar />
    </div>
  );
};

export default Settings;
