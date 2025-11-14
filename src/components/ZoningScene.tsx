// components/ZoningScene.tsx
'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'

import ZoningBox from './Zone3D'
import ControlPanel from './ZoningControls'
import CameraController from './CameraController'

import { useZoning } from '@/contexts/ZoningContext'

export const ZoningScene: React.FC = () => {
  const {
    scale,
    dimensions,
    zoningData,
    selectedZone,
    isInitialized,
    handleZoneSelect
  } = useZoning()

  return (
    <div className='w-full h-screen flex flex-col lg:flex-row bg-linear-to-br from-gray-100 to-gray-300'>
      {/* Canvas Section - Main Content */}
      <div className='flex-1 relative min-h-[60vh] lg:min-h-full'>
        <Canvas>
          <CameraController />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <group scale={[scale, scale, scale]}>
            <ZoningBox
              level={0}
              position={[0, 0, 0]}
              zone={zoningData.zone}
              onZoneSelect={handleZoneSelect}
              selectedZoneId={selectedZone?.id}
              size={[dimensions.width, dimensions.height, dimensions.depth]}
            />
          </group>
        </Canvas>

        {/* Loading overlay */}
        {!isInitialized && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='text-white text-lg'>Loading...</div>
          </div>
        )}
      </div>

      {/* Control Panel Section - Sidebar */}
      <div className='w-full lg:w-96 xl:w-120 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto shrink-0'>
        <ControlPanel />
      </div>
    </div>
  )
}

export default ZoningScene
