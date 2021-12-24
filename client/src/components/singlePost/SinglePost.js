import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "./singlePost.css";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";

const SinglePost = () => {
  const { user } = useContext(Context);
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const PF = "http://localhost:4000/images/";

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/posts/${path}`);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${path}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    await axios.put(`/posts/${path}`, {
      username: user.username,
      title,
      desc,
    });
    setUpdateMode(false);
  };

  return post ? (
    <div className="singlePost">
      <div className="singlePostWrapper">
        <img
          src={
            post.photo
              ? PF + post.photo
              : "https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg"
          }
          className="singlePostImg"
          alt="single"
        />
        {updateMode ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="singlePostTitleInput"
            autoFocus
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user.username && (
              <div
                className="singlePostEdit"
                onClick={() => setUpdateMode(true)}
              >
                <i className="singlePostIcon far fa-edit"></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}

        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link className="link" to={`/?user=${post.username}`}>
              <b>{post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="singlePostDescInput"
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default SinglePost;
