import React, { useEffect, useState } from "react";
import { Onboarding } from "./components";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

export function MyInfo() {
    const [loading, setLoading] = useState(true);

    const [birthYear, setBirthYear] = useState<string>("");
    const [gender, setGender] = useState<"male" | "female" | "">("");

    const [error, setError] = useState<string>("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(["birthYear", "gender"], (result) => {
            setBirthYear(result.birthYear ?? "");
            setGender(result.gender ?? "");
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!birthYear) {
            setError("출생연도를 입력해주세요.");
        } else if (!/^\d{4}$/.test(birthYear)) {
            setError("출생연도는 4자리 숫자여야 합니다.");
        } else {
            const year = parseInt(birthYear, 10);
            if (year < MIN_YEAR || year > CURRENT_YEAR) {
                setError(
                    `출생연도는 ${MIN_YEAR}~${CURRENT_YEAR} 사이여야 합니다.`,
                );
            } else {
                setError("");
            }
        }
    }, [birthYear]);

    const handleSave = () => {
        chrome.storage.sync.set({ birthYear, gender }, () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    };

    if (birthYear === "" && gender === "") {
        return <Onboarding />;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="mb-4">
                <label
                    htmlFor="birthYearInput"
                    className="block font-medium mb-1"
                >
                    출생연도
                </label>
                <input
                    id="birthYearInput"
                    type="text"
                    inputMode="numeric"
                    placeholder="예시 2025"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className={`border p-2 w-full rounded ${
                        error ? "border-purple-500" : "border-gray-300"
                    }`}
                />

                {error && (
                    <p className="text-sm text-purple-600 mt-1">
                        <strong>숫자를 다시 확인해주세요.</strong> {error}
                    </p>
                )}
            </div>

            {/* 성별 선택 */}
            <div className="mb-4">
                <label className="block font-medium mb-1">성별</label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`px-4 py-2 border rounded ${
                            gender === "male"
                                ? "bg-blue-500 text-white"
                                : "bg-white text-black border-gray-300"
                        }`}
                    >
                        남자
                    </button>
                    <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`px-4 py-2 border rounded ${
                            gender === "female"
                                ? "bg-pink-500 text-white"
                                : "bg-white text-black border-gray-300"
                        }`}
                    >
                        여자
                    </button>
                </div>
                {!gender && (
                    <p className="text-sm text-gray-500 mt-1">
                        스토리지: 비어있습니다
                    </p>
                )}
            </div>

            {/* 저장 버튼 */}
            <button
                onClick={handleSave}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                disabled={!!error || loading}
            >
                저장하기
            </button>
            {saved && (
                <p className="text-green-600 mt-2 text-sm font-medium">
                    저장되었습니다!
                </p>
            )}
        </div>
    );
}
