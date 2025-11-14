'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

import { Zone, ZoneSide } from '@/types/zoning'
import { useZoning } from '@/contexts/ZoningContext'

import {
  getZoningDirectionConfig,
  calculateZoningChildLayout
} from '@/utils/direction'
import { SizeCalculator } from '@/utils/sizeCalculator'
import { LayoutCalculator } from '@/utils/layoutCalculator'
import { DivisionRuleParser } from '@/utils/divisionRuleParser'
import { DirectionConfigCalculator } from '@/utils/directionConfigCalculator'

export const CameraController: React.FC = () => {
  const { scale, dimensions,values, zoningData, showOverview, selectedZone } = useZoning()
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  const isAnimating = useRef(false)
  const animationProgress = useRef(0)
  const startTarget = useRef(new THREE.Vector3())
  const targetTarget = useRef(new THREE.Vector3())
  const startPosition = useRef(new THREE.Vector3())
  const targetPosition = useRef(new THREE.Vector3())

  // Fix the recursive zone finding function
  const findZoneRecursive = useCallback(
    (
      zone: Zone,
      parentPos: THREE.Vector3,
      parentSize: number[],
      variables: Record<string, number>
    ): {
      position: THREE.Vector3
      size: number[]
      clickableSide?: ZoneSide
    } | null => {
      if (zone.index === selectedZone?.id) {
        return {
          position: parentPos,
          size: parentSize,
          clickableSide: zone.clickable
        }
      }

      if (zone.children?.length) {
        const parsedLindiv = DivisionRuleParser.parseDivisionRuleWithVariables(
          zone.linDiv,
          variables
        )
        // Handle INNER partitions
        if (zone.divDir === 'I') {
          const partitionCount =
            SizeCalculator.getPartitionCountFromString(parsedLindiv)
          const childrenToProcess = zone.children.slice(0, partitionCount)

          for (let i = 0; i < childrenToProcess.length; i++) {
            const child = childrenToProcess[i]
            const result = findZoneRecursive(
              child,
              parentPos.clone(),
              [...parentSize],
              variables
            )
            if (result) return result
          }
        } else {
          // Handle other partition types
          const directionConfig = DirectionConfigCalculator.getDirectionConfig(
            zone.divDir,
            zone.horDefType,
            zone.divElem
          )

          const parentDimension = parentSize[directionConfig.childSizeIndex]
          const childSizes = SizeCalculator.calculateChildSizesFromString(
            parentDimension,
            parsedLindiv
          )

          if (!childSizes || childSizes.length === 0) {
            return null
          }

          const parentPosition: [number, number, number] = [
            parentPos.x,
            parentPos.y,
            parentPos.z
          ]
          const parentSizeTuple: [number, number, number] = [
            parentSize[0],
            parentSize[1],
            parentSize[2]
          ]

          const childLayouts = LayoutCalculator.calculateLayoutsFromConfig(
            parentPosition,
            parentSizeTuple,
            childSizes,
            directionConfig
          )

          const childrenToProcess = zone.children.slice(0, childLayouts.length)

          for (let i = 0; i < childrenToProcess.length; i++) {
            const child = childrenToProcess[i]
            const layout = childLayouts[i]
            if (layout) {
              const result = findZoneRecursive(
                child,
                new THREE.Vector3(...layout.position),
                layout.size,
                variables
              )
              if (result) return result
            }
          }
        }
      }

      return null
    },
    [selectedZone?.id]
  )

  const getCameraPositionForSide = useCallback(
    (
      zonePos: THREE.Vector3,
      zoneSize: number[],
      side: ZoneSide,
      scale: number
    ): { position: THREE.Vector3; target: THREE.Vector3 } => {
      const [width, height, depth] = zoneSize
      const scaledZonePos = new THREE.Vector3(
        zonePos.x * scale,
        zonePos.y * scale,
        zonePos.z * scale
      )

      // Calculate appropriate camera distance based on zone size
      const maxDimension = Math.max(width, height, depth)
      const cameraDistance = maxDimension * scale * 2.5

      let position: THREE.Vector3
      const target = scaledZonePos.clone()

      switch (side) {
        case 'FRONT':
          position = new THREE.Vector3(
            scaledZonePos.x,
            scaledZonePos.y + height * scale * 0.5,
            scaledZonePos.z + cameraDistance
          )
          break
        case 'BACK':
          position = new THREE.Vector3(
            scaledZonePos.x,
            scaledZonePos.y + height * scale * 0.5,
            scaledZonePos.z - cameraDistance
          )
          break
        case 'LEFT':
          position = new THREE.Vector3(
            scaledZonePos.x - cameraDistance,
            scaledZonePos.y + height * scale * 0.5,
            scaledZonePos.z
          )
          break
        case 'RIGHT':
          position = new THREE.Vector3(
            scaledZonePos.x + cameraDistance,
            scaledZonePos.y + height * scale * 0.5,
            scaledZonePos.z
          )
          break
        default:
          position = new THREE.Vector3(
            scaledZonePos.x,
            scaledZonePos.y + height * scale * 0.5,
            scaledZonePos.z + cameraDistance
          )
      }

      return { position, target }
    },
    []
  )

  const updateCameraPosition = useCallback(
    (forceUpdate = false) => {
      if (!controlsRef.current) return

      isAnimating.current = true
      animationProgress.current = 0
      startPosition.current.copy(camera.position)
      startTarget.current.copy(controlsRef.current.target)

      if (showOverview) {
        // Overview position - show entire structure
        const maxDimension = Math.max(
          dimensions.width,
          dimensions.height,
          dimensions.depth
        )
        const overviewDistance = maxDimension * scale * 3

        targetPosition.current.set(
          overviewDistance * 0.7,
          overviewDistance * 0.7,
          overviewDistance * 0.7
        )
        targetTarget.current.set(0, 0, 0)
      } else if (selectedZone?.id) {
        // Find the selected zone
        const zoneInfo = findZoneRecursive(
          zoningData.zone,
          new THREE.Vector3(0, 0, 0),
          [dimensions.width, dimensions.height, dimensions.depth],
          values
        )

        if (zoneInfo) {
          const { position: zonePos, size: zoneSize } = zoneInfo
          const { position, target } = getCameraPositionForSide(
            zonePos,
            zoneSize,
            selectedZone?.side,
            scale
          )
          targetPosition.current.copy(position)
          targetTarget.current.copy(target)
        } else {
          // Fallback to default position if zone not found
          const maxDimension = Math.max(
            dimensions.width,
            dimensions.height,
            dimensions.depth
          )
          const defaultDistance = maxDimension * scale * 2
          targetPosition.current.set(
            defaultDistance * 0.3,
            defaultDistance * 0.3,
            defaultDistance
          )
          targetTarget.current.set(0, 0, 0)
        }
      } else {
        // Default position
        const maxDimension = Math.max(
          dimensions.width,
          dimensions.height,
          dimensions.depth
        )
        const defaultDistance = maxDimension * scale * 2
        targetPosition.current.set(
          defaultDistance * 0.3,
          defaultDistance * 0.3,
          defaultDistance
        )
        targetTarget.current.set(0, 0, 0)
      }

      if (forceUpdate) {
        camera.position.copy(targetPosition.current)
        controlsRef.current.target.copy(targetTarget.current)
        controlsRef.current.update()
        isAnimating.current = false
      }
    },
    [
      camera,
      scale,
      values,
      zoningData,
      dimensions,
      selectedZone,
      showOverview,
      findZoneRecursive,
      getCameraPositionForSide
    ]
  )

  // Initialize camera
  useEffect(() => {
    if (controlsRef.current) {
      const maxDimension = Math.max(
        dimensions.width,
        dimensions.height,
        dimensions.depth
      )
      const distance = maxDimension * scale * (showOverview ? 3 : 2)

      if (showOverview) {
        camera.position.set(distance * 0.7, distance * 0.7, distance * 0.7)
      } else {
        camera.position.set(distance * 0.3, distance * 0.3, distance)
      }

      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [camera])

  // Update camera when dependencies change
  useEffect(() => {
    updateCameraPosition()
  }, [selectedZone, showOverview, values, zoningData, updateCameraPosition])

  // Animation loop
  useEffect(() => {
    if (!controlsRef.current || !isAnimating.current) return

    const animate = () => {
      if (!isAnimating.current) return

      animationProgress.current += 0.05
      const progress = Math.min(animationProgress.current, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(
        startPosition.current,
        targetPosition.current,
        easedProgress
      )
      controlsRef.current.target.lerpVectors(
        startTarget.current,
        targetTarget.current,
        easedProgress
      )
      controlsRef.current.update()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        isAnimating.current = false
      }
    }

    animate()
  }, [camera, selectedZone])

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={1000}
      />
    </>
  )
}

export default CameraController
