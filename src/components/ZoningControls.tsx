// components/ControlPanel.tsx
'use client'

import React from 'react'
import { useZoning } from '@/contexts/ZoningContext'

// Sub-component for variable controls
const VariableControls: React.FC = () => {
  const { values, updateValue, randomizeValues } = useZoning()

  return (
    <div className='space-y-4 mb-6'>
      {/* Randomize Button */}
      <div className='mb-4'>
        <button
          onClick={randomizeValues}
          className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm lg:text-base font-medium'
        >
          Randomize All Values
        </button>
        <p className='text-xs text-gray-500 mt-1 text-center'>
          Generate new random values for all variables
        </p>
      </div>

      {/* Variable Sliders */}
      {Object.entries(values)
        .sort(([a], [b]) => a.localeCompare(b)) // Sort variables alphabetically
        .map(([variable, value]) => (
          <div
            key={variable}
            className='p-3 bg-gray-50 rounded-lg border border-gray-200'
          >
            <label className='block text-sm font-medium mb-2 text-gray-700'>
              ${variable}:{' '}
              <span className='font-bold text-blue-600'>{value}</span>
            </label>
            <input
              type='range'
              min={
                variable.includes('IS')
                  ? '0'
                  : variable.includes('CNT')
                  ? '1'
                  : '100'
              }
              max={
                variable.includes('IS')
                  ? '1'
                  : variable.includes('CNT')
                  ? '20'
                  : '5000'
              }
              step={
                variable.includes('IS') || variable.includes('CNT') ? '1' : '10'
              }
              value={value}
              onChange={e => updateValue(variable, parseInt(e.target.value))}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb'
            />
            <div className='flex justify-between text-xs text-gray-600 mt-2'>
              <span>Min</span>
              <span>Value: {value}</span>
              <span>Max</span>
            </div>
          </div>
        ))}
    </div>
  )
}

const GlobalDimensions: React.FC = () => {
  const { dimensions, updateDimension } = useZoning()

  return (
    <div className='mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200'>
      <h3 className='text-md font-semibold mb-3 text-blue-800'>
        Global Dimensions
      </h3>
      <div className='space-y-4'>
        {(['width', 'height', 'depth'] as const).map(dimension => (
          <div key={dimension}>
            <label className='block text-sm font-medium mb-2 capitalize text-blue-700'>
              {dimension}:{' '}
              <span className='font-bold'>{dimensions[dimension]}</span>
            </label>
            <input
              type='range'
              min='1000'
              max='10000'
              step='100'
              value={dimensions[dimension]}
              onChange={e =>
                updateDimension(dimension, parseInt(e.target.value))
              }
              className='w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb'
            />
            <div className='flex justify-between text-xs text-blue-600 mt-2'>
              <span>1000</span>
              <span>5000</span>
              <span>10000</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Sub-component for lindiv display
const LindivDisplay: React.FC = () => {
  const { processedLindiv, dimensions } = useZoning()

  return (
    <div className='mb-6 p-3 bg-gray-100 rounded-lg'>
      <h3 className='text-sm font-semibold mb-2 text-gray-800'>
        Current Lindiv:
      </h3>
      <code className='text-xs bg-white p-2 rounded border border-gray-300 block font-mono break-all'>
        {processedLindiv}
      </code>
      <div className='text-xs text-gray-600 mt-2 flex justify-between'>
        <span>Total width: {dimensions.width}</span>
        <span>Depth: {dimensions.depth}</span>
      </div>
    </div>
  )
}

// Sub-component for zone info
const ZoneInfo: React.FC = () => {
  const { selectedZone, values } = useZoning()

  if (!selectedZone) return null

  return (
    <div className='mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200'>
      <h3 className='text-sm font-semibold mb-2 text-blue-800'>
        Selected Zone Info
      </h3>
      <div className='text-xs space-y-1 text-blue-700'>
        <div>Zone: {selectedZone.id}</div>
        <div>Total Variables: {Object.keys(values).length}</div>
        <div>Camera will auto-adjust to zone size changes</div>
      </div>
    </div>
  )
}

// Sub-component for current variables display
const CurrentVariables: React.FC = () => {
  const { values } = useZoning()

  return (
    <div className='mb-6 p-3 bg-green-50 rounded-lg border border-green-200'>
      <h3 className='text-sm font-semibold mb-2 text-green-800'>
        Current Variables
      </h3>
      <div className='text-xs space-y-1 text-green-700 max-h-32 overflow-y-auto'>
        {Object.entries(values)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([variable, value]) => (
            <div key={variable} className='flex justify-between'>
              <span className='font-mono'>${variable}</span>
              <span className='font-bold'>{value}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// Sub-component for info panel
const InfoPanel: React.FC = () => {
  const { values, selectedZone, showOverview, hasParentZone } = useZoning()

  return (
    <div className='text-sm space-y-2 text-gray-600'>
      <p>• Click on zones to focus camera</p>
      <p>• Camera auto-adjusts when zone sizes change</p>
      <p>• Use Overview button to see entire structure</p>
      <p>
        • <strong>{Object.keys(values).length} variables</strong> currently
        active
      </p>
      {hasParentZone && (
        <p className='text-green-600 font-semibold'>• Parent zone available</p>
      )}
      {selectedZone?.id && (
        <p className='text-green-600 font-semibold'>
          Selected: {selectedZone?.id}
        </p>
      )}
      {showOverview && (
        <p className='text-blue-600 font-semibold'>Overview Mode</p>
      )}
    </div>
  )
}

export const ControlPanel: React.FC = () => {
  const { hasParentZone, handleOverview, handleResetView, handleParentZone } =
    useZoning()

  return (
    <div className='h-full bg-white p-4 lg:p-6 overflow-y-auto'>
      <h2 className='text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-gray-800'>
        Zoning Controls
      </h2>

      {/* Global Dimensions */}
      {/* <GlobalDimensions /> */}

      {/* Action Buttons */}
      <div className='flex flex-col gap-2 mb-6'>
        <div className='flex gap-2'>
          <button
            onClick={handleOverview}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm lg:text-base'
          >
            Overview
          </button>
          <button
            onClick={handleResetView}
            className='flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm lg:text-base'
          >
            Reset View
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-2'>
          {hasParentZone && (
            <button
              onClick={handleParentZone}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm lg:text-base'
            >
              Parent
            </button>
          )}
        </div>
      </div>

      {/* Zone Sizes Info */}
      <ZoneInfo />

      {/* Current Lindiv Display */}
      <LindivDisplay />

      {/* Current Variables Display */}
      <CurrentVariables />

      {/* Variable Controls with Randomize Button */}
      <VariableControls />

      {/* Info Panel */}
      <InfoPanel />
    </div>
  )
}

export default ControlPanel
