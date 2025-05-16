import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

export const MountCartSummaryApp = () => {
    const container = document.createElement("div");
    container.id = "coupang-cart-summary-root";

    const target = document.querySelector(".shopping-cart-new-layout");
    if (target && !document.getElementById("coupang-cart-summary-root")) {
        target.parentNode?.insertBefore(container, target);

        const root = createRoot(container);
        root.render(<CartSummary />);
    }
};

interface CartItem {
    title: string;
    price: string;
    quantity: string;
}

const parseCartItems = (): CartItem[] => {
    const items: CartItem[] = [];
    const productNodes = document.querySelectorAll(".cart-deal-item");

    productNodes.forEach((node) => {
        const title =
            node.querySelector(".product-name")?.textContent?.trim() || "";
        const price =
            node.querySelector(".unit-total-sale-price")?.textContent?.trim() ||
            "";
        const quantity =
            (node.querySelector("input.quantity-input") as HTMLInputElement)
                ?.value || "1";

        if (title && price) {
            items.push({ title, price, quantity });
        }
        console.log(title, price, quantity);
    });

    return items;
};

const CartSummary: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const found = parseCartItems();
        setItems(found);
    }, []);

    if (items.length === 0) return <p>장바구니에 상품이 없습니다.</p>;

    return (
        <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                🛒 장바구니 요약
            </h3>
            <ul style={{ paddingLeft: "20px" }}>
                {items.map((item, idx) => (
                    <li key={idx}>
                        {item.title} - {item.price} × {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CartSummary;
