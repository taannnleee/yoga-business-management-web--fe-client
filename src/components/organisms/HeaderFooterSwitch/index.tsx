// components/HeaderSwitcher.tsx
"use client";

import React from "react";
import Header from "@/components/organisms/Header";
import HeaderV2Course from "@/components/organisms/HeaderCourse";
import {usePathname, useRouter} from "next/navigation";

const HeaderSwitcher: React.FC = () => {
    const pathname = usePathname()

    return pathname.startsWith("/course") ? <HeaderV2Course /> : <Header />;
};

export default HeaderSwitcher;
