"use client"

import AntdProvider from "./antd-provider/AntdProvider"
import ReactQueryProvider from "./react-query-proivder/ReactQueryProvider"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReactQueryProvider>
            <AntdProvider>
                {children}
            </AntdProvider>
        </ReactQueryProvider>
    )
}

export default AppProvider 