interface CartItem {
    name: string;
    quantity: number;
    price: number;
    originalPrice: number;
    discountRate: number;
}

export const extractCartItems = (): CartItem[] => {
    const cartItems: CartItem[] = [];
    const cartItemElements = document.querySelectorAll(".cart-deal-item");

    cartItemElements.forEach((item) => {
        const nameElement = item.querySelector(".product-name");
        const quantityInput = item.querySelector(
            ".quantity-input",
        ) as HTMLInputElement;
        const priceElement = item.querySelector(".unit-total-sale-price");
        const originalPriceElement = item.querySelector(".anchor-price");
        const discountRateElement = item.querySelector(".discount-rate span");

        if (nameElement && quantityInput && priceElement) {
            const name = nameElement.textContent?.trim() || "";
            const quantity = parseInt(quantityInput.value) || 1;
            const price = parseInt(
                priceElement.textContent?.replace(/[^0-9]/g, "") || "0",
            );
            const originalPrice = parseInt(
                originalPriceElement?.textContent?.replace(/[^0-9]/g, "") ||
                    "0",
            );
            const discountRate = parseInt(
                discountRateElement?.textContent?.replace(/[^0-9]/g, "") || "0",
            );

            cartItems.push({
                name,
                quantity,
                price,
                originalPrice,
                discountRate,
            });
        }
    });

    return cartItems;
};

export const sendCartItemsToBackground = () => {
    const cartItems = extractCartItems();
    chrome.runtime.sendMessage({
        type: "CART_ITEMS_UPDATE",
        data: cartItems,
    });
};
