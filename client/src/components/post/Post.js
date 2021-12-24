import React from "react";
import { Link } from "react-router-dom";
import "./post.css";

const Post = ({ post }) => {
  const PF = "http://localhost:4000/images/";
  return (
    <div className="post">
      <img
        className="postImg"
        src={
          post.photo
            ? PF + post.photo
            : "https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress"
        }
        alt="post"
      />
      <div className="postInfo">
        <div className="postCats">
          {post.categories?.map((c) => (
            <span key={c._id} className="postCat">
              {c.name}
            </span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
          <span className="postTitle">{post.title}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <div className="postDesc">{post.desc}</div>
    </div>
  );
};

export default Post;
