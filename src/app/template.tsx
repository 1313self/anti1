"use client";

import MotionWrapper from "@/components/ui/motion-wrapper";

export default function Template({ children }: { children: React.ReactNode }) {
    return <MotionWrapper>{children}</MotionWrapper>;
}
