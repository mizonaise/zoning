// components/ZoningBox.tsx
'use client'

import React, { useState, useCallback, useRef } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'

import { Zone, BoxProps, ZoneSide } from '@/types/zoning'
import { useZoning } from '@/contexts/ZoningContext'
import { GEOMETRY_OFFSET, HOVER_COLOR } from '@/constants/colors'

import { SizeCalculator } from '@/utils/sizeCalculator'
import { LayoutCalculator } from '@/utils/layoutCalculator'
import { DivisionRuleParser } from '@/utils/divisionRuleParser'
import { DirectionConfigCalculator } from '@/utils/directionConfigCalculator'

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Determines if parents should be disabled based on child selection
 */
const shouldDisableParents = (zone: Zone, selectedZoneId?: string): boolean => {
  if (!selectedZoneId) return false
  if (zone.index === selectedZoneId) return false
  if (selectedZoneId.startsWith(zone.index + '.')) return true
  return false
}

/**
 * Determines if a specific child should be disabled based on parent's state
 */
const shouldDisableChild = (
  child: Zone,
  parentZone: Zone,
  isParentSelected: boolean,
  selectedZoneId?: string
): boolean => {
  // If parent is not modifiable, use child's original disabled state
  if (!parentZone.modifiable && !parentZone.disabled) {
    return !!child.disabled
  }

  // If parent is selected, ALL children are enabled
  if (isParentSelected) {
    return !!child.disabled
  }

  // If ANY descendant is selected in this branch, enable ALL children at this level
  // This allows navigation between siblings
  if (selectedZoneId && selectedZoneId.startsWith(parentZone.index + '.')) {
    return !!child.disabled
  }

  // Parent is modifiable but not selected - disable ALL children
  return true
}

// =============================================================================
// Types
// =============================================================================

interface ZoningBoxProps extends BoxProps {
  selectedZoneId?: string
  onZoneSelect?: (zoneId: string, zoneSide: ZoneSide) => void
}

// =============================================================================
// Sub-Components
// =============================================================================

interface MainBoxProps {
  width: number
  depth: number
  height: number
  isSelected: boolean
  position: [number, number, number]
}

const MainBox = React.forwardRef<THREE.Mesh, MainBoxProps>(
  ({ width, height, depth, position, isSelected }, ref) => (
    <mesh ref={ref} position={position}>
      <boxGeometry
        args={[
          width - GEOMETRY_OFFSET,
          height - GEOMETRY_OFFSET,
          depth - GEOMETRY_OFFSET
        ]}
      />
      <meshStandardMaterial visible={false} transparent opacity={0} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={isSelected ? 'green' : 'black'} />
      </lineSegments>
    </mesh>
  )
)

MainBox.displayName = 'MainBox'

// =============================================================================

interface ClickablePlaneProps {
  position: [number, number, number]
  width: number
  height: number
  rotation?: [number, number, number]
  color?: string
  isModifiable: boolean
  onPointerOut: () => void
  onPointerOver: () => void
  onClick: (event: ThreeEvent<MouseEvent>) => void
}

const ClickablePlane = React.forwardRef<THREE.Mesh, ClickablePlaneProps>(
  (
    {
      position,
      width,
      height,
      rotation = [0, 0, 0],
      color = HOVER_COLOR,
      isModifiable,
      ...handlers
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)

    const handlePointerEnter = useCallback(
      (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()
        if (isModifiable) {
          setIsHovered(true)
        }
      },
      [isModifiable]
    )

    const handlePointerLeave = useCallback(
      (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()
        setIsHovered(false)
      },
      []
    )

    const handleClick = useCallback(
      (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        handlers.onClick(event)
      },
      [handlers]
    )

    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          transparent={true}
          color={color}
          visible={isHovered}
          opacity={isHovered ? 0.8 : 0}
        />
      </mesh>
    )
  }
)

ClickablePlane.displayName = 'ClickablePlane'

// =============================================================================
// Custom Hooks
// =============================================================================

interface UseChildComponentsProps {
  zone: Zone
  position: [number, number, number]
  size: [number, number, number]
  level: number
  selectedZoneId?: string
  onZoneSelect?: (zoneId: string, zoneSide: ZoneSide) => void
  variables: Record<string, number>
}

const useChildComponents = ({
  zone,
  size,
  level,
  position,
  onZoneSelect,
  selectedZoneId,
  variables
}: UseChildComponentsProps) => {
  const [x, y, z] = position
  const [width, height, depth] = size
  const isParentSelected = selectedZoneId === zone.index

  return React.useMemo(() => {
    if (!zone.children?.length) return null

    const parsedLindiv = DivisionRuleParser.parseDivisionRuleWithVariables(
      zone.linDiv,
      variables
    )

    // Handle INNER partitions (divDir: "I")
    if (zone.divDir === 'I') {
      const partitionCount =
        SizeCalculator.getPartitionCountFromString(parsedLindiv)

      return zone.children.slice(0, partitionCount).map((child, index) => {
        const shouldDisable = shouldDisableChild(
          child,
          zone,
          isParentSelected,
          selectedZoneId
        )

        return (
          <ZoningBox
            key={`${child.index}-${index}`}
            zone={{ ...child, disabled: shouldDisable }}
            position={position}
            size={size}
            level={level + 1}
            onZoneSelect={onZoneSelect}
            selectedZoneId={selectedZoneId}
          />
        )
      })
    }

    // Handle VERTICAL and HORIZONTAL partitions
    const directionConfig = DirectionConfigCalculator.getDirectionConfig(
      zone.divDir,
      zone.horDefType,
      zone.divElem
    )

    const parentDimension = size[directionConfig.childSizeIndex]

    const childSizes = SizeCalculator.calculateChildSizesFromString(
      parentDimension,
      parsedLindiv
    )

    // Add validation for child sizes
    if (!childSizes || childSizes.length === 0) {
      console.warn(`No child sizes calculated for zone ${zone.index}`)
      return null
    }

    const childLayouts = LayoutCalculator.calculateLayoutsFromConfig(
      position,
      size,
      childSizes,
      directionConfig
    )

    if (zone.index === '0.2.1.1') {
      console.log({
        variables,
        linDiv: zone.linDiv,
        parsedLindiv,
        directionConfig,
        parentDimension,
        childSizes,
        childLayouts
      })
    }
    return zone.children.slice(0, childLayouts.length).map((child, index) => {
      const layout = childLayouts[index]
      if (!layout) {
        console.warn(
          `No layout found for child ${child.index} at index ${index}`
        )
        return null
      }

      const shouldDisable = shouldDisableChild(
        child,
        zone,
        isParentSelected,
        selectedZoneId
      )

      return (
        <ZoningBox
          key={`${child.index}-${index}`}
          zone={{ ...child, disabled: shouldDisable }}
          position={layout.position}
          size={layout.size}
          level={level + 1}
          onZoneSelect={onZoneSelect}
          selectedZoneId={selectedZoneId}
        />
      )
    })
  }, [
    x,
    y,
    z,
    zone,
    level,
    width,
    depth,
    height,
    onZoneSelect,
    selectedZoneId,
    variables,
    isParentSelected
  ])
}

// =============================================================================
// Clickable Planes Helper
// =============================================================================

interface ClickablePlaneConfig {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number
  height: number
}

const getClickablePlanes = (
  position: [number, number, number],
  size: [number, number, number],
  clickableSide?: ZoneSide
): ClickablePlaneConfig[] => {
  const [x, y, z] = position
  const [width, height, depth] = size
  const planes: ClickablePlaneConfig[] = []

  if (!clickableSide || clickableSide === 'FRONT') {
    planes.push({
      position: [x, y, z + depth / 2],
      rotation: [0, 0, 0],
      width,
      height
    })
  }
  if (!clickableSide || clickableSide === 'BACK') {
    planes.push({
      position: [x, y, z - depth / 2],
      rotation: [0, Math.PI, 0],
      width,
      height
    })
  }
  if (!clickableSide || clickableSide === 'LEFT') {
    planes.push({
      position: [x - width / 2, y, z],
      rotation: [0, -Math.PI / 2, 0],
      width: depth,
      height
    })
  }
  if (!clickableSide || clickableSide === 'RIGHT') {
    planes.push({
      position: [x + width / 2, y, z],
      rotation: [0, Math.PI / 2, 0],
      width: depth,
      height
    })
  }

  return planes
}

// =============================================================================
// Main Component
// =============================================================================

export const ZoningBox: React.FC<ZoningBoxProps> = ({
  zone,
  size,
  level,
  position,
  onZoneSelect,
  selectedZoneId
}) => {
  const { values, handleZoneSelect: contextHandleZoneSelect } = useZoning()

  const [width, height, depth] = size
  const meshRef = useRef<THREE.Mesh>(null)
  const planeRefs = useRef<(THREE.Mesh | null)[]>([])

  const isSelected = selectedZoneId === zone.index
  const isParentDisabled = shouldDisableParents(zone, selectedZoneId)
  const finalDisabled = zone.disabled || isParentDisabled
  const isInteractive = zone.modifiable && !finalDisabled && !isSelected

  // Use context handler if no local handler provided
  const handleZoneSelect = onZoneSelect || contextHandleZoneSelect

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation?.()
      if (
        isSelected ||
        finalDisabled ||
        !zone.clickable ||
        !zone.modifiable ||
        !handleZoneSelect
      )
        return
      handleZoneSelect(zone.index, zone.clickable)
    },
    [isSelected, zone.modifiable, finalDisabled, zone.index, handleZoneSelect]
  )

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = isInteractive ? 'pointer' : 'default'
  }, [isInteractive])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default'
  }, [])

  const childComponents = useChildComponents({
    zone,
    position,
    size,
    level,
    selectedZoneId,
    onZoneSelect: handleZoneSelect,
    variables: values
  })

  const clickablePlanes = getClickablePlanes(position, size, zone.clickable)

  if (planeRefs.current.length !== clickablePlanes.length) {
    planeRefs.current = clickablePlanes.map(
      (_, i) => planeRefs.current[i] || null
    )
  }

  if (zone.empty && !zone.children?.length) return null
  if (zone.empty) return <>{childComponents}</>

  return (
    <group>
      <MainBox
        ref={meshRef}
        width={width}
        depth={depth}
        height={height}
        position={position}
        isSelected={isSelected}
      />

      {isInteractive &&
        clickablePlanes.map((plane, index) => (
          <ClickablePlane
            key={index}
            ref={(el: THREE.Mesh | null) => {
              planeRefs.current[index] = el
            }}
            position={plane.position}
            rotation={plane.rotation}
            width={plane.width}
            height={plane.height}
            color={zone.color}
            onClick={handleClick}
            onPointerOut={handlePointerOut}
            onPointerOver={handlePointerOver}
            isModifiable={isInteractive}
          />
        ))}

      {childComponents}
    </group>
  )
}

export default React.memo(ZoningBox)
