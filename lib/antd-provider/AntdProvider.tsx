'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';
import React from 'react';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <AntdRegistry>
            <ConfigProvider
                locale={faIR}
                direction="rtl"
                theme={{
                    token: {
                        colorPrimary: '#00afaa',
                        fontFamily: 'var(--font-dana)',
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </AntdRegistry>
    );
}