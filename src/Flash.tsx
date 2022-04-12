import React, { useEffect, useState } from "react";


export type FlashProps = {children: React.ReactNode, time: number, hide: boolean};

export function Flash({children, time, hide}: FlashProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!hide) return
        const timer = setTimeout(() => {
            setVisible(false);
        }, time);
        return () => clearTimeout(timer)
    }, [time]);

    return visible ? <>{children}</> : null;

}