import React from "react";
import memesData from "../memesData.js";

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg"
    });
    const [allMemeImages, setAllMemeImages] = React.useState(memesData);
    const canvasRef = React.useRef(null);
    
    function getMemeImage() {
        const memesArray = allMemeImages.data.memes;
        const randomNumber = Math.floor(Math.random() * memesArray.length);
        const url = memesArray[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }));
    }
    
    function handleChange(event) {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }
    
    function drawMemeToCanvas() {
        return new Promise((resolve) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = meme.randomImage;

            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                
                ctx.font = "30px Impact";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                
                ctx.fillText(meme.topText, canvas.width / 2, 40);
                ctx.strokeText(meme.topText, canvas.width / 2, 40);
                
                ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
                ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20);

                resolve();
            };
        });
    }
    
    async function downloadMeme() {
        await drawMemeToCanvas();
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "custom_meme.png";
        link.click();
    }
    
    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Image URL"
                    className="url-input"
                    name="randomImage"
                    value={meme.randomImage}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a random meme image
                </button>
            </div>
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" alt="Meme" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <div class="button-container">
            <button class="download-btn">Download</button>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </main>
    );
}
