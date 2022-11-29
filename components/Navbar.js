import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../context/uiSlice";

import { Cart } from "./";

const Navbar = () => {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.isShowCart);

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <div className="navbar-container">
      <p>
        <Link href="/">A.K. Headphones</Link>
      </p>
      <button
        type="button"
        className="cart-icon"
        onClick={() => {
          dispatch(uiActions.toggleCart());
        }}
      >
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantity}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
