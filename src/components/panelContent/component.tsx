import React, { useRef } from "react";
import { useFocusManagement } from "@src/hooks/useFocusManagement";
import ControlMode from "@src/components/modeButton/ControlMode";
import ControlFont from "@src/components/fontButton/ControlFont";
import { ShortcutTab } from "@src/components/shortcutTab";
import { MyInfo } from "@src/tabs/myInfo";
import ControlService from "@src/components/serviceButton/ControlService";
import { menuItems } from "@src/constants/menuItems";

interface PanelContentProps {
    menuId: string | null;
}

export const PanelContent: React.FC<PanelContentProps> = ({ menuId }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const { firstFocusableRef, lastFocusableRef, isPanelFocused } =
        useFocusManagement(menuId, panelRef);

    const renderPanelContent = () => {
        switch (menuId) {
            case "high-contrast":
                return <ControlMode />;
            case "font":
                return <ControlFont />;
            case "shortcut":
                return <ShortcutTab />;
            case "my-info":
                return <MyInfo />;
            case "service":
                return <ControlService />;
            default:
                return null;
        }
    };

    if (!menuId) return null;

    return (
        <div
            ref={panelRef}
            tabIndex={isPanelFocused.current ? 0 : -1}
            role="tabpanel"
            aria-label={`${menuItems.find((item) => item.id === menuId)?.text} 설정`}
        >
            {renderPanelContent()}
        </div>
    );
};
