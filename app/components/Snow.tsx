import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function Snow() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    });

    // Set window dimensions on load, and listen for resize events
    useEffect(() => {
        const updateWindowDimensions = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        updateWindowDimensions();
        window.addEventListener("resize", updateWindowDimensions);
        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);

    return (
        <div style={{position: "fixed", top: 0, left: 0, bottom: 0, right: 0 }}>
        <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            colors={["#e56137", "#4ab44f"]}
            numberOfPieces={50}
            initialVelocityY={8}
            drawShape={ctx => {
                const centerX = 12;
                const centerY = 12;
                const drawBranch = (angle: number) => {
                    const length = 12;
                    const endX = centerX + length * Math.cos(angle);
                    const endY = centerY + length * Math.sin(angle);
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    ctx.closePath();
                };
                const numBranches = Math.floor(Math.random() * 5 + 5);
                for (let i = 0; i < numBranches; i++) {
                    const angle = (i * 2 * Math.PI) / numBranches;
                    drawBranch(angle);
                } 
                }}
        />
        </div>
    )
}