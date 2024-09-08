import React, { useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";

const spawnRadius = 10;

const FallingBodies = ({
    carPosition,
    start,
    setGameOver,
    setScore,
    score,
}) => {
    const [bodies, setBodies] = useState([]);
    const maxBodies = 100;
    const spawnInterval = 2000;


    useEffect(() => {
        if (start) {
            const intervalId = setInterval(() => {
                if (bodies.length < maxBodies) {
                    const bodyType = Math.floor(Math.random() * 3) + 1;
                    let bodyArgs;
                    if (bodyType === 1) {
                        bodyArgs = [
                            Math.random() * 3 + 1,
                            Math.random() * 3 + 1,
                            Math.random() * 3 + 1,
                        ];
                    } else if (bodyType === 2) {
                        bodyArgs = [Math.random() * 2 + 1, 32, 32];
                    } else if (bodyType === 3) {
                        bodyArgs = [
                            Math.random() * 2 + 1,
                            Math.random() * 2 + 1,
                            Math.random() * 3 + 1,
                            32,
                        ];
                    }

                    const x =
                        carPosition[0] +
                        Math.random() * spawnRadius * 2 -
                        spawnRadius;
                    const z =
                        carPosition[2] +
                        Math.random() * spawnRadius * 2 -
                        spawnRadius -
                        30;

                    setBodies((prev) => [
                        ...prev,
                        {
                            id: Date.now(),
                            position: [x, 10, z],
                            bodyType,
                            bodyArgs,
                        },
                    ]);
                }
                if (-carPosition[2] > score)
                    setScore(Math.floor(-carPosition[2]));
            }, spawnInterval);

            return () => clearInterval(intervalId);
        }
    }, [bodies, start]);

    return (
        <>
            {bodies.map((body) => (
                <RigidBody
                    key={body.id}
                    position={body.position}
                    mass={1}
                    linearDamping={0.1}
                    angularDamping={0.1}
                    friction={0.5}
                    restitution={0.3}
                    onCollisionEnter={(other) => {
                        console.log(
                            "Collision detected:",
                            other.rigidBodyObject.name
                        );
                        if (other.rigidBodyObject.name === "car") {
                            console.log("executing");
                            setGameOver(1);
                        }
                    }}
                    name="fallingBody"
                >
                    <mesh>
                        {body.bodyType === 1 && (
                            <boxGeometry args={body.bodyArgs} />
                        )}
                        {body.bodyType === 2 && (
                            <sphereGeometry args={[body.bodyArgs[0], 32, 32]} />
                        )}
                        {body.bodyType === 3 && (
                            <cylinderGeometry args={body.bodyArgs} />
                        )}
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
};

export default FallingBodies;
