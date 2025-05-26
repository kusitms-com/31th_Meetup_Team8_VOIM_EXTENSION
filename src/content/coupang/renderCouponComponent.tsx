// content.ts
export const renderCouponComponent = () => {
    console.log("[voim] 쿠폰 자동 다운로드 로직 시작");

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const tryDownloadCoupons = async () => {
        const downloadBtn = document.querySelector(
            ".prod-coupon-download-btn",
        ) as HTMLButtonElement;
        if (!downloadBtn) {
            console.log("[voim] 쿠폰 다운로드 버튼을 찾을 수 없음");
            return false;
        }

        const couponLayer = document.querySelector(
            ".prod-coupon-download-layer",
        ) as HTMLElement;
        if (!couponLayer) {
            console.log("[voim] 쿠폰 레이어를 찾을 수 없음");
            return false;
        }

        console.log("[voim] 쿠폰 레이어 발견:", couponLayer);

        const originalDisplay = couponLayer.style.display;
        couponLayer.style.display = "block";

        // 렌더링 대기
        await wait(300);

        const couponItems = document.querySelectorAll<HTMLLIElement>(
            ".prod-coupon-download-content li.prod-coupon-download-item__on",
        );
        console.log("[voim] 쿠폰 아이템 개수:", couponItems.length);

        if (couponItems.length > 0) {
            couponItems.forEach((item, index) => {
                const url = item.getAttribute("data-url");
                console.log(`[voim] 쿠폰 #${index + 1} URL: ${url}`);
                item.click(); // 자동 클릭으로 다운로드
            });
            console.log("[voim] 쿠폰 자동 다운로드 완료");
        } else {
            console.log("[voim] 다운로드 가능한 쿠폰이 없음");
        }

        // 쿠폰 레이어 원복
        couponLayer.style.display = originalDisplay;

        // 다운로드 버튼 비활성화
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = "0.5";
        downloadBtn.style.cursor = "not-allowed";
        downloadBtn.style.border = "1px solid #999";
        downloadBtn.style.color = "#999";
        downloadBtn.style.filter = "grayscale(100%)";

        console.log("[voim] 쿠폰 다운로드 버튼 비활성화 완료");
        return true;
    };

    // 초기 실행
    tryDownloadCoupons().catch(console.error);

    // DOM 변화 감지
    const observer = new MutationObserver((mutations, obs) => {
        console.log("[voim] DOM 변경 감지:", mutations.length, "개");

        tryDownloadCoupons()
            .then((success) => {
                if (success) {
                    console.log("[voim] MutationObserver로 자동 다운로드 성공");
                    obs.disconnect();
                }
            })
            .catch(console.error);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 10초 후 자동 종료
    setTimeout(() => {
        observer.disconnect();
        console.log("[voim] MutationObserver 종료 (타임아웃)");
    }, 10000);
};
