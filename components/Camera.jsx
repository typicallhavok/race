import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

const Camera = ({ chassisRef }) => {
    const { camera } = useThree();
    const ref = useRef();

    useFrame(() => {
        if (chassisRef.current) {
            const pos = chassisRef.current.translation();
            camera.position.set(pos.x, pos.y + 5, pos.z + 10);
            camera.lookAt(pos.x, pos.y, pos.z);
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.position.set(0, 5, 10);
            ref.current.lookAt(0, 0, 0);
        }
    }, []);

    return <perspectiveCamera ref={ref} />;
};

export default Camera;
