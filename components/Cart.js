import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { TiDeleteOutline } from "react-icons/ti";
import { cartActions } from "../context/cartSlice";
import { uiActions } from "../context/uiSlice";

import { urlFor } from "../lib/client";
import { useSelector, useDispatch } from "react-redux";
import getStripe from "../lib/getStripe";

const Cart = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems);

  const image = cartItems[0]?.image[0].asset._ref;
  if (image?.includes("webp")) {
    console.log(image);
  } else {
    console.log("false");
  }
  const dispatch = useDispatch();
  const subTotal = useSelector((state) => state.cart.totalPrice);

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const togglecart = () => {
    dispatch(uiActions.toggleCart());
  };

  const cartRef = useRef();
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button type="button" className="cart-heading" onClick={togglecart}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">{totalQuantity} items</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping cart is empty</h3>
            <Link href="/">
              <button type="button" onClick={togglecart} className="btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item, i) => (
              <div className="product" key={item.id}>
                <img
                  src={urlFor(item?.image[0])}
                  alt="product"
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.title}</h5>
                    <h4>${item.total}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() => {
                            dispatch(
                              cartActions.removeFromCart({ id: item.id })
                            );
                          }}
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() => {
                            dispatch(
                              cartActions.increaseCart({
                                id: item.id,
                              })
                            );
                          }}
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => {
                        dispatch(cartActions.removeItem(item.id));
                      }}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${subTotal}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay With Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
