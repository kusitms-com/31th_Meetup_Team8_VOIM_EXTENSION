import React from "react";

interface Props {
    coupons: string[];
}

export const CouponComponent: React.FC<Props> = ({ coupons }) => {
    if (!coupons || coupons.length === 0) return null;

    const commonTextStyle: React.CSSProperties = {
        fontFamily: "KoddiUD OnGothic",
        fontSize: "28px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "150%",
        textAlign: "center",
    };

    const firstCoupon = coupons[0];
    const remainingCount = coupons.length - 1;

    return (
        <div
            style={{
                padding: "16px",
                borderRadius: "20px",
                width: "618px",
                border: "4px solid #8914FF",
                backgroundColor: "#ffffff",
            }}
        >
            <p style={commonTextStyle}>
                {firstCoupon}
                {remainingCount > 0 &&
                    ` 외 ${remainingCount}종의 쿠폰이 있습니다.`}
            </p>
        </div>
    );
};
