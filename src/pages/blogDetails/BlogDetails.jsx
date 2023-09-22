import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { request } from '../../utils/fetchApi';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';
import { format } from 'timeago.js';
import classes from './blogDetails.module.css';

import {
  AiFillEdit,
  AiFillLike,
  AiFillDelete,
  AiOutlineArrowRight,
  AiOutlineLike,
} from 'react-icons/ai';

const BlogDetails = () => {
  const [blogDetails, setBlogDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const options = { Authorization: `Bearer ${token}` };
        const data = await request(`/blog/find/${id}`, 'GET', options);
        setBlogDetails(data);
        setIsLiked(data.likes.includes(user._id));
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Set loading to false in case of error
        // You can handle errors here, e.g., redirect to an error page
        navigate('error'); // Redirect to an error page
      }
    };
    fetchBlogDetails();
  }, [id, user._id, token, navigate]); // Remove 'history' from the dependency array

  const handleLikePost = async () => {
    try {
      const options = { Authorization: `Bearer ${token}` };
      await request(`/blog/likeBlog/${id}`, 'PUT', options);
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error(error);
      // Handle error if the like operation fails
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const options = { Authorization: `Bearer ${token}` };
      await request(`/blog/deleteBlog/${id}`, 'DELETE', options);
      // Redirect to the home page after successful deletion
      navigate('/');
    } catch (error) {
      console.error(error);
      // Handle error if the deletion fails
    }
  };

  return (
    <>
      <Navbar />
      <div className={classes.container}>
        <Link to="/" className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        {isLoading ? (
          <p>Loading...</p> // Display a loading message while fetching data
        ) : (
          <div className={classes.wrapper}>
            <img
              src={`http://localhost:5000/images/${blogDetails?.photo}`}
              alt={`Image for ${blogDetails?.title}`} // Add meaningful alt text
            />
            <div className={classes.titleAndControls}>
              <h3 className={classes.title}>{blogDetails?.title}</h3>
              {blogDetails?.userId?._id === user._id ? (
                <div className={classes.controls}>
                  <Link to={`/updateBlog/${blogDetails?._id}`} className={classes.edit}>
                    <AiFillEdit />
                  </Link>
                  <div className={classes.delete}>
                    <AiFillDelete onClick={handleDeleteBlog} />
                  </div>
                </div>
              ) : (
                <>
                  {isLiked ? (
                    <div className={classes.like}>
                      <AiFillLike onClick={handleLikePost} />
                    </div>
                  ) : (
                    <div className={classes.like}>
                      <AiOutlineLike onClick={handleLikePost} />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={classes.descAndLikesViews}>
              <p className={classes.desc}>
                <span>Description: </span>
                {blogDetails?.desc}
              </p>
              <div className={classes.likesAndViews}>
                <span>{blogDetails?.views} views</span>
                <span>{blogDetails?.likes?.length} likes</span>
              </div>
            </div>
            <div className={classes.authorAndCreatedAt}>
              <span>
                <span>Author:</span> {blogDetails?.userId?.username}
              </span>
              <span>
                <span>Created At:</span> {format(blogDetails?.createdAt)}
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogDetails;
