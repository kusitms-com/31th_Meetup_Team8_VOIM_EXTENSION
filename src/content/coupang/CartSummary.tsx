import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeContextProvider, useTheme } from "@src/contexts/ThemeContext";

export const MountCartSummaryApp = () => {
    const container = document.createElement("div");
    container.id = "coupang-cart-summary-root";
    container.style.margin = "20px 0";
    container.style.padding = "10px";

    const target = document.querySelector(".shopping-cart-new-layout");
    if (target && !document.getElementById("coupang-cart-summary-root")) {
        target.parentNode?.insertBefore(container, target);

        const root = createRoot(container);
        root.render(
            <ThemeContextProvider>
                <CartSummary />
            </ThemeContextProvider>,
        );
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

const CartSummary = () => {
    const { fontClasses, theme } = useTheme();
    const isDarkMode = theme === "dark";

    const [items, setItems] = useState<CartItem[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const found = parseCartItems();
        setItems(found);
    }, []);

    if (items.length === 0) return <p>장바구니에 상품이 없습니다.</p>;

    const visibleItems = showAll ? items : items.slice(0, 3);

    const totalPrice = items
        .reduce((acc, item) => {
            const numericPrice = Number(item.price.replace(/[^0-9]/g, ""));
            const quantity = Number(item.quantity);
            return acc + numericPrice * quantity;
        }, 0)
        .toLocaleString();

    const containerStyle = {
        borderRadius: "20px",
        border: "4px solid #8914FF",
        fontFamily: "KoddiUDOnGothic",
        width: "563px",
        padding: "28px",
        backgroundColor: isDarkMode ? "#212121" : "#FFFFFF",
        color: isDarkMode ? "#F5F5F5" : "#212121",
    };

    const headerStyle = {
        display: "flex",
        flexDirection: "column" as const,
        gap: "16px",
        marginBottom: "26px",
    };

    const titleStyle = {
        fontSize: fontClasses.fontHeading,
        color: isDarkMode ? "#F5F5F5" : "#212121",
    };

    const subtitleStyle = {
        color: "#8914FF",
        fontSize: fontClasses.fontHeading,
    };

    const priceContainerStyle = {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        fontSize: fontClasses.fontCommon,
    };

    const itemListStyle = {
        display: "flex",
        flexDirection: "column" as const,
        gap: "16px",
        marginBottom: "16px",
    };

    const itemStyle = {
        display: "flex",
        justifyContent: "space-between",
        fontSize: fontClasses.fontCommon,
        padding: "8px 0",
        borderBottom: "1px solid #E0E0E0",
    };

    const buttonStyle = {
        fontFamily: "KoddiUDOnGothic",
        fontSize: fontClasses.fontCommon,
        padding: "16px 30px",
        position: "relative" as const,
        width: "100%",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        transition: "opacity 0.2s, background-color 0.2s",
        backgroundColor: isDarkMode ? "#B39DDB" : "#8914FF",
        color: isDarkMode ? "#212121" : "#F5F5F5",
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>장바구니 요약</div>
                <div style={subtitleStyle}>
                    총 {items.length}개의 상품이 담겨있습니다.
                </div>
            </div>

            <div style={priceContainerStyle}>
                <div>전체 금액</div>
                <div>{totalPrice}원</div>
            </div>

            <div style={itemListStyle}>
                {visibleItems.map((item, index) => (
                    <div key={index} style={itemStyle}>
                        <div>{item.title}</div>
                        <div>{item.price}</div>
                    </div>
                ))}
            </div>

            <button
                style={buttonStyle}
                onClick={() => setShowAll(!showAll)}
                aria-label={showAll ? "상품 목록 접기" : "상품 목록 펼치기"}
            >
                {showAll ? "상품 목록 접기" : "상품 목록 펼치기"}
            </button>
        </div>
    );
};
