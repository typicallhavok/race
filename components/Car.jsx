import { useFrame } from "@react-three/fiber";
import {
    RigidBody,
    useRevoluteJoint,
    useSphericalJoint,
} from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { Vector3 } from "three";

const Car = ({ chassis, setCarPosition, start, setStart }) => {
    const carRef = useRef(null);
    const wheelBL = useRef(null);
    const wheelBR = useRef(null);
    const wheelF = useRef(null);
    const [mouseX, setMouseX] = useState(0);
    const [speed, setSpeed] = useState(0);
    useRevoluteJoint(chassis, wheelBL, [
        [-0.5, 0, 0.5],
        [0, 0, 0],
        [0.6, 0, 0],
    ]);

    useRevoluteJoint(chassis, wheelBR, [
        [0.5, 0, 0.5],
        [0, 0, 0],
        [0.6, 0, 0],
    ]);

    useSphericalJoint(chassis, wheelF, [
        [0, 0, -0.8],
        [0, 0, 0],
    ]);

    const handleClick = () => {
        setStart(1);
    };

    useEffect(() => {
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    useFrame(() => {
        if (start && chassis.current) {
            const pos = chassis.current.translation();
            setCarPosition([pos.x, pos.y, pos.z]);
        }
    });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
            setMouseX(normalizedX);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "w":
                    setSpeed((prev) => Math.min(prev + 0.1, 3));
                    break;
                case "s":
                    setSpeed((prev) => Math.max(prev - 0.1, 0));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useFrame(() => {
        const chassisBody = chassis.current;
        const wheelFbody = wheelF.current;
        if (start && chassisBody) {
            const forwardForceMagnitude = 0.008;

            const forwardForce = new Vector3(
                0,
                0,
                -forwardForceMagnitude * speed
            );
            chassisBody.applyImpulse(forwardForce, true);

            const sidewaysForce = new Vector3(
                mouseX * forwardForceMagnitude * 5,
                0,
                0
            );
            wheelFbody.applyImpulse(sidewaysForce, true);

            const velocity = chassisBody.linvel();
            const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

            if (currentSpeed > 5) {
                const normalizedVelocity = {
                    x: (velocity.x / currentSpeed) * 8,
                    y: 0,
                    z: (velocity.z / currentSpeed) * 8,
                };
                chassisBody.setLinvel(normalizedVelocity, true);
            }

            const angVel = chassisBody.angvel();
            const maxAngVel = Math.PI / 6;
            if (Math.abs(angVel.x) > maxAngVel) {
                chassisBody.setAngvel(
                    {
                        x: maxAngVel * Math.sign(angVel.x),
                        y: angVel.y,
                        z: angVel.z,
                    },
                    true
                );
            }
            if (Math.abs(angVel.z) > maxAngVel) {
                chassisBody.setAngvel(
                    {
                        x: angVel.x,
                        y: angVel.y,
                        z: maxAngVel * Math.sign(angVel.z),
                    },
                    true
                );
            }

            if (wheelF.current) {
                const wheel = wheelF.current;
                const steeringAngle = Math.min(
                    Math.max((mouseX * Math.PI) / 6, -Math.PI / 3),
                    Math.PI / 3
                );
                wheel.setRotation({ x: 0, y: steeringAngle, z: 0 });
            }
        }
    });

    return (
        <group ref={carRef}>
            <RigidBody
                ref={chassis}
                position={[0, 0.4, 0]}
                mass={10}
                linearDamping={0.5}
                angularDamping={0.5}
                friction={1}
                restitution={0}
                name="car"
            >
                <mesh>
                    <boxGeometry args={[0.8, 0.4, 1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
            <RigidBody
                ref={wheelBR}
                position={[0.6, 0.2, 0.6]}
                mass={5}
                linearDamping={0.8}
                angularDamping={0.8}
                friction={1}
                restitution={0}
                name="car"
                ccd
            >
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
            <RigidBody
                ref={wheelBL}
                position={[-1.2, 0.2, 0.6]}
                mass={5}
                linearDamping={0.8}
                angularDamping={0.8}
                friction={1}
                restitution={0}
                name="car"
                ccd
            >
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
            <RigidBody
                ref={wheelF}
                position={[0, 0.5, -0.4]}
                mass={50}
                friction={1}
                restitution={0}
                colliders="ball"
                linearDamping={0.8}
                angularDamping={0.8}
                name="car"
                ccd
            >
                <mesh>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
        </group>
    );
};

export default Car;
