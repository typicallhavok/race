import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { Sky } from "@react-three/drei";
import { useRef, useState } from "react";
import FallingBodies from "../components/FallingBodies";

const Car = dynamic(() => import("../components/Car"), { ssr: false });
const Road = dynamic(() => import("../components/Road"), { ssr: false });
const Camera = dynamic(() => import("../components/Camera"), { ssr: false });

const Scene = () => {
    const chassis = useRef(null);
    const [carPosition, setCarPosition] = useState([0, 0.4, 0]);
    const [start, setStart] = useState(0);
    const [gameOver, setGameOver] = useState(0);
    const [outOfBounds, setOutOfBounds] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [score, setScore] = useState(0);

    const keyframes = `
        body{
            margin:0;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `;

    useEffect(() => {
        if ((Math.abs(carPosition[0]) >= 15)||(carPosition[1]<-.5)) {
            setGameOver(1);
            setOutOfBounds(1);
        }
    }, [carPosition]);

    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                fontFamily: "helvetica",
                margin: "0",
            }}
        >
            <style>{keyframes}</style>
            {!gameOver && (
                <div
                    style={{
                        zIndex: "2",
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        left: "10%",
                        top: "10%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.5rem",
                        }}
                    >
                        <img src="/img/wKey.png" width={50} height={50} />
                        move front
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.5rem",
                        }}
                    >
                        <img src="/img/sKey.png" width={50} height={50} />
                        move back
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.5rem",
                        }}
                    >
                        <img src="/img/arrow.png" width={50} height={50} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.5rem",
                        }}
                    >
                        <img
                            style={{ transform: "rotate(-45deg)" }}
                            src="/img/mouse.png"
                            width={50}
                            height={50}
                        />
                        move sideways
                    </div>
                </div>
            )}
            {!start && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        zIndex: "5",
                        fontSize: "6em",
                        color: "white",
                        fontWeight: "bold",
                        pointerEvents: "none",
                        animation: "fadeInOut 1.5s infinite",
                        fontFamily: "helvetica",
                    }}
                >
                    Click to Start
                </div>
            )}

            {!start && !gameOver ? (
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "70%",
                        fontFamily: "helvetica",
                        zIndex: "2",
                        color: "#b148d2",
                        fontSize: "5rem",
                        fontWeight: "bold",
                    }}
                >
                    SCORE:{score}
                </div>
            ) : !gameOver ? (
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "70%",
                        fontFamily: "helvetica",
                        zIndex: "2",
                        color: "#b148d2",
                        fontSize: "5rem",
                    }}
                >
                    {score}
                </div>
            ) : null}
            {(!gameOver && (
                <Canvas>
                    <Sky />
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[0, 5, 10]} intensity={1} />
                    <Suspense>
                        <Physics colliders="hull">
                            <Car
                                chassis={chassis}
                                setCarPosition={setCarPosition}
                                start={start}
                                setStart={setStart}
                            />
                            <Road speed={0.1} carPosition={carPosition} />
                            <FallingBodies
                                carPosition={carPosition}
                                start={start}
                                setGameOver={setGameOver}
                                setScore={setScore}
                                score={score}
                            />
                        </Physics>
                    </Suspense>
                    <Camera chassisRef={chassis} />
                </Canvas>
            )) || (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        fontFamily: "helvetica",
                        backgroundColor: "lightblue",
                        fontSize: "2rem",
                    }}
                >
                    <h1 style={{ color: "#b148d2" }}>
                        {(!outOfBounds && "Game Over!") || "Out of Bounds"}
                    </h1>
                    {!outOfBounds && (
                        <h1 style={{ color: "#b148d2" }}>Score: {score}</h1>
                    )}
                    <div
                        onMouseEnter={() => setIsHovered(1)}
                        onMouseLeave={() => setIsHovered(0)}
                        onClick={() => window.location.reload()}
                        style={{
                            cursor: "pointer",
                            fontFamily: "helvetica",
                            fontSize: "2.5rem",
                            color: `${(isHovered && "#e79aff") || "#b148d2"}`,
                            padding: "0",
                            border: "none",
                            fontWeight: "bold",
                        }}
                        className="playAgain"
                    >
                        Play Again
                    </div>
                </div>
            )}
        </div>
    );
};
export default Scene;
