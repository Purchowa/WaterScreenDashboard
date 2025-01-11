import appConfig from '../config.js'

import React, { useState, useEffect } from "react";
import { RgbColorPicker } from "react-colorful";
import axios from 'axios';
import JSONbig from 'json-bigint';

import { useAuth } from '@/context/AuthContext';

const ImageToBinary = () => {
    const [pixelArray, setPixelArray] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [mainColor, setMainColor] = useState({ r: 0, g: 0, b: 0 });
    const [secondaryColor, setSecondaryColor] = useState({ r: 255, g: 255, b: 255 });

    const { logout } = useAuth();

    function numberToBinaryRow(value) {
        const binaryString = value.toString(2);
        const paddedBinaryString = binaryString.padStart(64, "0");
        return Array.from(paddedBinaryString, (char) => Number(char));
    }

    const axiosBigInt = axios.create({
        transformResponse: [(data) => {
            try {
                return JSONbig.parse(data);
            } catch (error) {
                return data;
            }
        }]
    })
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        axiosBigInt.get(`${appConfig.host}/${appConfig.restURI}/dashboard/webPicture`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                const webPicture = response.data;
                setImageData(webPicture.data)
                setPixelArray(webPicture.data.map((value) => numberToBinaryRow(BigInt(value))));
                setMainColor(webPicture.colors.main);
                setSecondaryColor(webPicture.colors.secondary);
            })
            .catch(error => {
                console.error("There was an error getting the webPicture!", error);
                const unauthorizedStatus = 401;
                if (error.response.status === unauthorizedStatus)
                    logout();
                else {
                    console.error(error.response.data.message);
                }
            });
    }, [])

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file)
            return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 64;
            canvas.height = 40;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { data, width, height } = imageData;
            const binary = [];
            const uint64 = [];

            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    row.push(gray > 128 ? 0 : 1);
                }
                binary.push(row);
                const uint64Row = BigInt("0b" + row.join(""));
                uint64.push(uint64Row);
            }

            setPixelArray(binary);
            setImageData(uint64);
        };

        img.src = URL.createObjectURL(file);
    };

    const handleImageSend = () => {
        if (!imageData)
            return;

        const image = { data: imageData, size: imageData.length, colors: { main: mainColor, secondary: secondaryColor } };
        const token = localStorage.getItem('jwt');
        axios.post(`${appConfig.host}/${appConfig.restURI}/dashboard/webPicture`, JSONbig.stringify(image), {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json',
            }
        })
            .then(response => {
                console.log('WebPicture updated successfully', response.data);
            })
            .catch(error => {
                console.error("There was an error updating the webPicture!", error);
                const unauthorizedStatus = 401;
                if (error.response.status === unauthorizedStatus)
                    logout();
                else {
                    console.error(error.response.data.message);
                }
            });
    }

    const renderBinaryImage = () => {
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(64, 10px)`,
                    lineHeight: 0,
                    border: "2px solid black",
                }}
            >
                {pixelArray.flat().map((value, index) => (
                    <div
                        key={index}
                        style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: `rgb(${value === 1 ? mainColor.r : secondaryColor.r}, ${value === 1 ? mainColor.g : secondaryColor.g}, ${value === 1 ? mainColor.b : secondaryColor.b})`,
                        }}
                    ></div>
                ))}
            </div>
        );
    };

    return (

        <div className="admin_content">
            <h2>Custom picture</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 8 }}>
                {pixelArray && (
                    <div>
                        {renderBinaryImage()}
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: 8 }} />
                <div style={{ margin: "20px 0", textAlign: 'center' }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <div>
                            <h3>Main</h3>
                            <RgbColorPicker color={mainColor} onChange={setMainColor} />
                        </div>
                        <div>
                            <h3>Secondary</h3>
                            <RgbColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                        </div>
                    </div>
                </div>
                <button onClick={handleImageSend} type="submit" className={`btn btn-lg btn-primary`}>Submit</button>
            </div>
        </div>
    );
};

export default ImageToBinary;
