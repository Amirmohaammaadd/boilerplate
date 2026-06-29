"use client"

import NextTopLoader from "nextjs-toploader"
import AntdProvider from "./antd-provider/AntdProvider"
import ReactQueryProvider from "./react-query-proivder/ReactQueryProvider"

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