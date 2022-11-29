import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { Product } from "../../components";
import { cartActions } from "../../context/cartSlice";
import { uiActions } from "../../context/uiSlice";
import { client, urlFor } from "../../lib/client";
import getStripe from "../../lib/getStripe";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, _id } = product;
  const dispatch = useDispatch();

  const [qty, setQty] = useState(0);

  const incQuantity = () => {
    setQty((prevstate) => prevstate + 1);
  };
  const decQuantity = () => {
    if (qty === 0) return;
    setQty((prevstate) => prevstate - 1);
  };

  const [index, setIndex] = useState(0);

  const addToCartHandler = () => {
    dispatch(
      cartActions.addToCart({
        id: _id,
        addedFromSlug: true,
        price,
        name,
        quantity: qty,
        description: details,
        image,
      })
    );
    setQty(0);
  };

  const handleBuyNow = async () => {
    dispatch(
      cartActions.addToCart({
        id: _id,
        name: name,
        quantity: qty,
        image: image,
        price: price,
        description: details,
      })
    );
    dispatch(uiActions.toggleCart());
  };

  const removeFromCartHandler = () => {
    dispatch(
      cartActions.removeFromCart({
        id: _id,
      })
    );
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
              alt="product"
            />
          </div>
          <div className="small-images-container">
            {image &&
              image?.map((item, i) => (
                <img
                  key={i}
                  src={urlFor(item)}
                  className={
                    i === index ? "small-image selected-image" : "small-image"
                  }
                  onMouseEnter={() => setIndex(i)}
                />
              ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQuantity}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQuantity}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == product]{
        slug{
            current
        }
    }`;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current =="${slug}"][0]`;
  const product = await client.fetch(query);

  const productQuery = `*[_type == "product"]`;
  const products = await client.fetch(productQuery);

  console.log(products);

  return { props: { product, products } };
};

export default ProductDetails;
