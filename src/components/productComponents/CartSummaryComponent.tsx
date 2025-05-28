import React, { useEffect, useState } from "react";

interface CartItem {
    name: string;
    quantity: number;
    price: number;
    originalPrice: number;
    discountRate: number;
}

const CartSummaryComponent: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // 초기 장바구니 데이터 로드
        chrome.storage.local.get(["cartItems"], (result) => {
            if (result.cartItems) {
                setCartItems(result.cartItems);
            }
        });

        // 장바구니 업데이트 메시지 리스너
        const handleMessage = (message: any) => {
            if (message.type === "CART_ITEMS_UPDATED") {
                setCartItems(message.data);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const totalOriginalPrice = cartItems.reduce(
        (sum, item) => sum + item.originalPrice * item.quantity,
        0,
    );
    const totalDiscount = totalOriginalPrice - totalPrice;

    return (
        <div style={{ padding: "20px", fontFamily: "KoddiUD OnGothic" }}>
            <h2
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                장바구니 요약
            </h2>

            <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "20px", marginBottom: "10px" }}>
                    총 {totalItems}개의 상품
                </div>
                <div style={{ fontSize: "20px", marginBottom: "10px" }}>
                    할인 전 금액: {totalOriginalPrice.toLocaleString()}원
                </div>
                <div
                    style={{
                        fontSize: "20px",
                        marginBottom: "10px",
                        color: "#8914FF",
                    }}
                >
                    할인 금액: {totalDiscount.toLocaleString()}원
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    결제 예정 금액: {totalPrice.toLocaleString()}원
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                    }}
                >
                    장바구니 상품 목록
                </h3>
                {cartItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "10px",
                            borderBottom: "1px solid #EAEDF4",
                            marginBottom: "10px",
                        }}
                    >
                        <div style={{ fontSize: "18px", marginBottom: "5px" }}>
                            {item.name}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>수량: {item.quantity}개</span>
                            <span>{item.price.toLocaleString()}원</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartSummaryComponent;
