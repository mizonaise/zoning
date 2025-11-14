// contexts/ZoningContext/ZoningContext.tsx
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo
} from 'react'
import { Zone, ZoneSide, ZoningData } from '@/types/zoning'
import {
  ZoningState,
  ZoningValues,
  ZoningDimensions,
  ZoningContextType,
  SelectedZone
} from '@/types/zoningContext'
import { DivisionRuleParser } from '@/utils/divisionRuleParser'
import { VariableProcessor } from '@/utils/variableProcessor'

// =============================================================================
// Helper Functions
// =============================================================================

const checkIfZoneIsModifiable = (zoneId: string, zone: Zone): boolean => {
  if (zone.index === zoneId) return zone.modifiable === true

  return (
    zone.children?.some(child => checkIfZoneIsModifiable(zoneId, child)) ??
    false
  )
}

const findZoneSide = (zone: Zone, targetId: string): ZoneSide | undefined => {
  if (zone.index === targetId) return zone.clickable
  for (const child of zone.children) {
    const result = findZoneSide(child, targetId)
    if (result) return result
  }
  return undefined
}

/**
 * Find a zone by ID in the zoning data
 */
const findZoneById = (rootZone: Zone, zoneId: string): Zone | null => {
  if (rootZone.index === zoneId) return rootZone

  for (const child of rootZone.children || []) {
    const found = findZoneById(child, zoneId)
    if (found) return found
  }

  return null
}

// =============================================================================
// Context Provider
// =============================================================================

const ZoningContext = createContext<ZoningContextType | undefined>(undefined)

interface ZoningProviderProps {
  children: ReactNode
  initialZone: ZoningData
  initialData?: Partial<ZoningState>
}

// Function to extract all variables from zoning data with their initial values
const extractVariablesFromZoning = (zoningData: ZoningData): ZoningValues => {
  const values: ZoningValues = {}

  // Add global variables first
  if (zoningData.variables) {
    Object.entries(zoningData.variables).forEach(
      ([variableName, variableValue]) => {
        const numericValue = parseFloat(variableValue)
        if (!isNaN(numericValue)) {
          values[variableName] = numericValue
        } else {
          // For expressions like "$ZR_W / $ZR_CNT", set initial value to 0
          // They will be calculated when needed
          values[variableName] = 0
        }
      }
    )
  }

  // Calculate dependent variables automatically through evaluation
  Object.keys(values).forEach(variableName => {
    const expression = zoningData.variables?.[variableName]
    if (expression && expression.includes('$')) {
      try {
        values[variableName] = VariableProcessor.evaluateExpression(
          expression,
          values
        )
      } catch (error) {
        console.warn(
          `Failed to calculate ${variableName}: ${expression}`,
          error
        )
      }
    }
  })

  return values
}

// Function to calculate dimensions from expressions
const calculateDimensionsFromExpressions = (
  zoningData: ZoningData,
  values: ZoningValues
): ZoningDimensions => {
  const calculateDimension = (expression: string): number => {
    if (!expression) return 5000 // Default fallback

    try {
      // Remove "mm" and trim
      const cleanExpr = expression.replace('mm', '').trim()
      // Evaluate the expression with current values
      return VariableProcessor.evaluateExpression(cleanExpr, values)
    } catch (error) {
      console.warn(
        `Failed to calculate dimension from expression: ${expression}`,
        error
      )
      return 5000 // Default fallback
    }
  }

  return {
    width: calculateDimension(zoningData.width),
    depth: calculateDimension(zoningData.depth),
    height: calculateDimension(zoningData.height)
  }
}

// Function to initialize values based on detected variables in the zoning data
const initializeValuesFromZoning = (zoningData: ZoningData): ZoningValues => {
  return extractVariablesFromZoning(zoningData)
}

export const ZoningProvider: React.FC<ZoningProviderProps> = ({
  children,
  initialZone,
  initialData
}) => {
  const scale = 0.01

  // Initialize with random values based on the zoning data
  const [values, setValues] = useState<ZoningValues>(() => {
    // Use initialData values if provided, otherwise generate random ones
    if (initialData?.values) {
      return initialData.values
    }
    return initializeValuesFromZoning(initialZone)
  })

  // Calculate initial dimensions
  const initialDimensions = useMemo(() => {
    return calculateDimensionsFromExpressions(initialZone, values)
  }, [initialZone, values])

  const [dimensions, setDimensions] =
    useState<ZoningDimensions>(initialDimensions)

  const [zoningData, setZoningData] = useState<ZoningData>({
    ...initialZone,
    ...initialData?.zoningData
  })

  const [showOverview, setShowOverview] = useState(
    initialData?.showOverview ?? true
  )
  const [isInitialized, setIsInitialized] = useState(
    initialData?.isInitialized ?? false
  )
  const [selectedZone, setSelectedZone] = useState<SelectedZone | undefined>(
    initialData?.selectedZone ?? { id: '0', side: 'FRONT' }
  )

  // Initialize with a small delay to ensure everything is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Update dimensions when values change
  useEffect(() => {
    const newDimensions = calculateDimensionsFromExpressions(zoningData, values)
    setDimensions(newDimensions)
  }, [values, zoningData])

  // Helper function to check if a zone is modifiable
  const checkIfZoneIsModifiable = (zoneId: string, zone: Zone): boolean => {
    if (zone.index === zoneId) {
      return zone.modifiable === true
    }

    if (zone.children) {
      for (const child of zone.children) {
        const result = checkIfZoneIsModifiable(zoneId, child)
        if (result !== false) return result
      }
    }

    return false
  }

  // Function to find the closest modifiable parent
  const findClosestModifiableParent = (zoneId: string): string | null => {
    const parts = zoneId.split('.')

    // Start from the direct parent and go up the hierarchy
    for (let i = parts.length - 1; i > 0; i--) {
      const parentId = parts.slice(0, i).join('.')

      // Check if this parent is modifiable by searching in the zoning data
      const isParentModifiable = checkIfZoneIsModifiable(
        parentId,
        zoningData.zone
      )
      if (isParentModifiable) {
        return parentId
      }
    }

    // Return the root if no other modifiable parent found
    return '0'
  }

  // Zone selection and navigation
  // Actions
  const handleZoneSelect = useCallback((zoneId: string, zoneSide: ZoneSide) => {
    setSelectedZone(prev =>
      prev?.id === zoneId ? undefined : { id: zoneId, side: zoneSide }
    )
    setShowOverview(false)
  }, [])

  const handleParentZone = useCallback(() => {
    if (selectedZone && selectedZone.id !== '0') {
      const parentZoneId = findClosestModifiableParent(selectedZone.id)
      if (parentZoneId) {
        const parentZoneSide = findZoneSide(zoningData.zone, parentZoneId)
        if (parentZoneSide) {
          setSelectedZone({ id: parentZoneId, side: parentZoneSide })
          setShowOverview(false)
        }
      }
    }
  }, [selectedZone, zoningData.zone])

  const handleOverview = useCallback(() => {
    setSelectedZone({ id: '0', side: 'FRONT' })
    setShowOverview(true)
  }, [])

  const handleResetView = useCallback(() => {
    setSelectedZone({ id: '0', side: 'FRONT' })
    setShowOverview(false)
  }, [])

  // New function to randomize all values
  const randomizeValues = () => {
    const newValues = initializeValuesFromZoning(zoningData)
    setValues(newValues)
  }

  // Data updates
  const updateValue = (variable: string, value: number) => {
    setValues(prev => {
      const newValues = {
        ...prev,
        [variable]: value
      }

      // Recalculate all dependent variables
      Object.keys(newValues).forEach(varName => {
        const expression = zoningData.variables?.[varName]
        if (expression && expression.includes('$')) {
          try {
            newValues[varName] = VariableProcessor.evaluateExpression(
              expression,
              newValues
            )
          } catch (error) {
            console.warn(
              `Failed to recalculate ${varName}: ${expression}`,
              error
            )
          }
        }
      })

      return newValues
    })
  }

  const updateDimension = (
    dimension: keyof ZoningDimensions,
    value: number
  ) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }))
  }

  const updateZoningData = (data: Partial<ZoningData>) => {
    setZoningData(prev => ({
      ...prev,
      ...data
    }))
  }

  // Computed values
  const hasParentZone = !!selectedZone?.id && selectedZone?.id !== '0'

  const processedLindiv = useMemo(() => {
    if (!selectedZone) return ''

    const zone = findZoneById(zoningData.zone, selectedZone.id)
    if (!zone || !zone.linDiv) return ''

    // Use zone-specific variables for processing
    return DivisionRuleParser.parseDivisionRuleWithVariables(
      zone.linDiv,
      values
    )
  }, [values, selectedZone, zoningData.zone])

  const contextValue: ZoningContextType = {
    // State
    zoningData,
    values,
    dimensions,
    selectedZone,
    showOverview,
    isInitialized,
    scale,

    // Actions
    handleZoneSelect,
    handleParentZone,
    handleOverview,
    handleResetView,
    updateValue,
    updateDimension,
    updateZoningData,
    findClosestModifiableParent,
    checkIfZoneIsModifiable,
    randomizeValues,

    // Computed (for convenience)
    hasParentZone,
    processedLindiv
  }

  return (
    <ZoningContext.Provider value={contextValue}>
      {children}
    </ZoningContext.Provider>
  )
}

// Custom hook to use the zoning context
export const useZoning = (): ZoningContextType => {
  const context = useContext(ZoningContext)
  if (context === undefined) {
    throw new Error('useZoning must be used within a ZoningProvider')
  }
  return context
}
