import localFont from 'next/font/local';

export const danaFont = localFont({
  src: [
    {
      path: './dana-fanum-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './dana-fanum-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-dana',
  display: 'swap',
});