import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  RoundedBox,
  Text,
  useCursor,
  useTexture,
} from "@react-three/drei";
import { easing } from "maath";

import { Fish } from "./Fish";
import { Cactoro } from "./Cactoro";
import { Yeti } from "./Yeti";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);

  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0, // camera position x
        0, // camera position y
        5, // camera position z
        targetPosition.x, // move camera-x to target position-x
        targetPosition.y, // move camera-y to target position-y
        targetPosition.z, // move camera-z to target position-z
        true // if we animate or not
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />

      <MonsterStage
        texture={"/textures/claymation_china_rainbow_mountains.jpg"}
        name={"Fish King"}
        color={"#38adcf"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Fish scale={0.6} position-y={-1} hovered={hovered === "Fish King"} />
      </MonsterStage>

      <MonsterStage
        texture={"/textures/anime_deserted_mountains.jpg"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        name={"Cactoro"}
        color={"#739d3c"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Cactoro scale={0.6} position-y={-1} hovered={hovered === "Cactoro"} />
      </MonsterStage>

      <MonsterStage
        texture={"/textures/realistic_snow_mountains.jpg"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        name={"Yeti"}
        color={"#794e7e"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Yeti scale={0.6} position-y={-1} hovered={hovered === "Yeti"} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);

  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;

    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>

      {/* Mesh for Portal */}
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial
          ref={portalMaterial}
          side={THREE.DoubleSide}
          // blend={active === name ? 1 : 0}
        >
          <ambientLight intensity={1} />
          <Environment preset="sunset" />

          {/* Character in portal */}
          {children}

          {/* Mesh for separate environments */}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
