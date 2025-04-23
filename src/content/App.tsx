import React, { useState } from "react";
import FloatingButton from "../components/FloatingButton";
import Modal from "../components/Modal";

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <FloatingButton
                onClick={openModal}
                iconUrl="chrome-extension://jeppkpjgeheckphiogogbffdenhlkclh/icons/icon-58.png"
            />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        익스텐션 창
                    </h2>
                    <p className="text-gray-600 mb-4">
                        여기에 원하는 내용을 넣으세요.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-500">
                            이 창은 React, Emotion, TypeScript, Tailwind CSS로
                            만들어졌습니다.
                        </p>
                    </div>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={closeModal}
                    >
                        닫기
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default App;
