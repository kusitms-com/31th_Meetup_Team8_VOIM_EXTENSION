// content.ts
export const renderCouponComponent = () => {
    console.log("[voim] 쿠폰 자동 다운로드 로직 시작");

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    let isDownloaded = false;
    let isDownloading = false;
    const clickedUrls = new Set<string>();

    const tryDownloadCoupons = async () => {
        if (isDownloaded || isDownloading) {
            console.log("[voim] 이미 다운로드가 진행 중이거나 완료되었습니다.");
            return true;
        }

        isDownloading = true;

        const downloadBtn = document.querySelector(
            ".prod-coupon-download-btn",
        ) as HTMLButtonElement | null;

        if (!downloadBtn) {
            console.log("[voim] 쿠폰 다운로드 버튼을 찾을 수 없음");
            isDownloading = false;
            return false;
        }

        const couponLayer = document.querySelector(
            ".prod-coupon-download-layer",
        ) as HTMLElement | null;

        if (!couponLayer) {
            console.log("[voim] 쿠폰 레이어를 찾을 수 없음");
            isDownloading = false;
            return false;
        }

        console.log("[voim] 쿠폰 레이어 발견:", couponLayer);

        const originalDisplay = couponLayer.style.display;
        couponLayer.style.display = "block";

        await wait(300);

        const couponItems = document.querySelectorAll<HTMLLIElement>(
            ".prod-coupon-download-content li.prod-coupon-download-item__on",
        );
        console.log("[voim] 쿠폰 아이템 개수:", couponItems.length);

        let newDownload = false;

        couponItems.forEach((item, index) => {
            const url = item.getAttribute("data-url");
            if (!url) return;

            if (!clickedUrls.has(url)) {
                console.log(`[voim] 쿠폰 #${index + 1} URL 클릭: ${url}`);
                clickedUrls.add(url);
                item.click();
                newDownload = true;
            } else {
                console.log(`[voim] 이미 클릭된 쿠폰: ${url}`);
            }
        });

        // 알림 자동 확인 (예: alert 대체)
        await wait(300);
        const confirmBtn = document.querySelector(
            "button.confirm, button:contains('확인')",
        ) as HTMLButtonElement | null;
        if (confirmBtn) {
            confirmBtn.click();
            console.log("[voim] 확인 버튼 자동 클릭");
        }

        // 레이어 원복
        couponLayer.style.display = originalDisplay;

        if (newDownload) {
            console.log("[voim] 쿠폰 자동 다운로드 완료");
            isDownloaded = true;

            // 다운로드 버튼 비활성화
            downloadBtn.disabled = true;
            downloadBtn.style.opacity = "0.5";
            downloadBtn.style.cursor = "not-allowed";
            downloadBtn.style.border = "1px solid #999";
            downloadBtn.style.color = "#999";
            downloadBtn.style.filter = "grayscale(100%)";
            console.log("[voim] 쿠폰 다운로드 버튼 비활성화 완료");
        } else {
            console.log("[voim] 다운로드 가능한 새 쿠폰이 없음");
        }

        isDownloading = false;
        return true;
    };

    // 초기 실행
    tryDownloadCoupons().catch(console.error);

    // DOM 변화 감지
    const observer = new MutationObserver((mutations, obs) => {
        if (isDownloaded) {
            console.log(
                "[voim] 이미 다운로드가 완료되어 MutationObserver를 종료합니다.",
            );
            obs.disconnect();
            return;
        }

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
