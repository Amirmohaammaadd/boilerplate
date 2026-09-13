"use client"

import NextTopLoader from "nextjs-toploader"
import AntdProvider from "./AntdProvider"
import ReactQueryProvider from "./ReactQueryProvider"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <NextTopLoader color="#2299DD" />
            <ReactQueryProvider>
                <AntdProvider>
                    {children}
                </AntdProvider>
            </ReactQueryProvider>
        </>
    )
}

export default AppProvider 