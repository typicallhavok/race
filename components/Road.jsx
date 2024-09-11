import { useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame,useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three';



const Road = ({ carPosition }) => {
const roadTexture = useLoader(TextureLoader, '/img/road-texture.jpg');


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
                <meshStandardMaterial map={roadTexture}/>
            </mesh>
        </RigidBody>
    );
};

export default Road;
