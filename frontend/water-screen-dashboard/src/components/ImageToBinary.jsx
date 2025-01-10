import React, { useState } from "react";
import { RgbColorPicker } from "react-colorful";

const ImageToBinary = () => {
    const [binaryArray, setBinaryArray] = useState(null);
    const [binaryImage, setBinaryImage] = useState(null);
    const [mainColor, setMainColor] = useState({ r: 0, g: 0, b: 0 });
    const [secondaryColor, setSecondaryColor] = useState({ r: 255, g: 255, b: 255 });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file)
            return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 64;
            canvas.height = 50;
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

            setBinaryArray(binary);
            setBinaryImage(uint64);
        };

        img.src = URL.createObjectURL(file);
    };

    const handleImageSend = () => {
        if (!binaryImage)
            return;
        console.log(binaryImage.toString())
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
                {binaryArray.flat().map((value, index) => (
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 8 }}>
            {binaryArray && (
                <div>
                    {renderBinaryImage()}
                </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: 8 }} />
            <div style={{ margin: "20px 0", textAlign: 'center' }}>
                <h2>Choose colors</h2>
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
    );
};

export default ImageToBinary;
