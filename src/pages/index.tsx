import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { TwitterPicker } from 'react-color';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [content, setContent] = useState<string>('');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [light, setLight] = useState<string>('#FFF');
  const [dark, setDark] = useState<string>('#000');

  const generateQR = async () => {
    if (! content.length) {
      setDataUrl('')
      return
    }
    try {
      setDataUrl(await QRCode.toDataURL(content, {
        errorCorrectionLevel: 'H',
        type: "image/png",
        width: 1000,
        scale: 1,
        color: {
          dark,
          light
        }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLightColor = (color: { hex: string }) => {
    setLight(color.hex);
  };

  const handleDarkColor = (color: { hex: string }) => {
    setDark(color.hex);
  };

  useEffect(() => {
    generateQR()
  }, [dark, light, dataUrl])


  return (
    <>
      <Head>
        <title>QR Code Generator</title>
        <meta name="description" content="QR Code Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center my-10 text-green-400 max-w-md mx-auto">
        <h1 className="text-3xl font-bold">
          QR Code Generator
        </h1>
        <p className="mt-4">Paste below the url you wish to generate a QR-Code</p>
        <div className="mt-4 flex justify-between gap-4 w-full">
          <input
            type="text"
            className="flex-1 bg-gray-800 p-2"
            value={content}
            onChange={(el) => setContent(el.target.value)}
          />
          <button onClick={generateQR} className="px-6 py-4 rounded bg-green-900 font-bold uppercase">
            Generate!
          </button>
        </div>
        <div className='flex mt-4 gap-4'>
          <div>
            <span className='block mb-2'>Background Color</span>
            <TwitterPicker
              color={ light }
              onChangeComplete={ handleLightColor }
            />
          </div>
          
          <div>
            <span className='block mb-2'>Code Color</span>
            <TwitterPicker
              color={ dark }
              onChangeComplete={ handleDarkColor }
            />
          </div>
        </div>
        {dataUrl.length ? (
          <div className="mt-8 flex flex-col items-center">
            <h2 className="font-bold text-xl mb-4">Your QR-Code:</h2>

            <Image src={dataUrl} alt="Your QR-Code" width={1000} height={1000} />
          </div>
        ): ''}
      </main>
    </>
  );
}
