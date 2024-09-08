import { useRef, useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

const Road = ({ carPosition }) => {
    const roadRef = useRef(null);
    const [roadLength, setRoadLength] = useState(1000);

    useFrame(() => {
        if (roadRef.current && carPosition) {
            const carZ = carPosition[2];
            const threshold = 50;
            if (-carZ > roadLength / 4 - threshold) {
                setRoadLength((prevLength) => prevLength + 100);
            }
        }
    });

    return (
        <RigidBody
            colliders="cuboid"
            type="fixed"
            friction={1}
            restitution={0}
            position={[0, 0, 0]}
            name="road"
        >
            <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, roadLength, 800, 800]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        </RigidBody>
    );
};

export default Road;
