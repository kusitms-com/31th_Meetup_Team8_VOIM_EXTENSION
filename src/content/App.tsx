import React, { useState } from "react";
import FloatingButton from "../components/FloatingButton";
import Modal from "../components/Modal";

interface AppProps {
    extensionId: string;
}
const App = ({ extensionId }: AppProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <FloatingButton
                onClick={openModal}
                iconUrl={`chrome-extension://${extensionId}/icons/icon.png`}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                        익스텐션 창
                    </h2>
                    <p className="mb-4 text-gray-600">
                        여기에 원하는 내용을 넣으세요.
                    </p>
                    <div className="p-4 mb-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-500">
                            이 창은 React, Emotion, TypeScript, Tailwind CSS로
                            만들어졌습니다.
                        </p>
                    </div>
                    <button
                        className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
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
