// app/page.tsx
'use client'

import { ZoningData } from '@/types/zoning'
import { ZoningScene } from '@/components/ZoningScene'
import { ZoningProvider } from '@/contexts/ZoningContext'

// Example zoning data
const exampleZone: ZoningData = {
  width: '($ZB_W + $ZL_D + $ZR_D) mm',
  depth: '$ZONE_D mm',
  height: '$ZONE_H mm',

  zone: {
    name: 'OAKSOME_SHAPE_U_04',
    index: '0',
    divDir: 'I',
    linDiv: {
      value: '3*{1}'
    },
    divElem: 0,
    horDefType: 'P',
    empty: false,
    clickable: 'FRONT',
    modifiable: false,
    children: [
      {
        index: '0.0',
        divDir: 'H',
        linDiv: {
          value: '1:$ZR_D mm'
        },
        divElem: 0,
        horDefType: 'W',
        empty: false,
        clickable: 'FRONT',
        modifiable: false,
        children: [
          {
            index: '0.0.0',
            divDir: 'V',
            linDiv: {
              value: ''
            },
            divElem: 0,
            horDefType: 'P',
            empty: true,
            clickable: 'FRONT',
            modifiable: false,
            children: []
          },
          {
            index: '0.0.1',
            divDir: 'H',
            linDiv: {
              value: '1:($IS_BM_P * $ZB_D )mm'
            },
            divElem: 3,
            horDefType: 'D',
            empty: false,
            clickable: 'FRONT',
            modifiable: false,
            children: [
              {
                index: '0.0.1.0',
                divDir: 'H',
                linDiv: {
                  value: '1:((1 - $IS_BM_P )* $ZB_D + $ZR_W)mm'
                },
                divElem: 3,
                horDefType: 'D',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: [
                  {
                    index: '0.0.1.0.0',
                    divDir: 'V',
                    linDiv: {
                      value: ''
                    },
                    divElem: 0,
                    horDefType: 'P',
                    empty: true,
                    clickable: 'FRONT',
                    modifiable: false,
                    children: []
                  },
                  {
                    index: '0.0.1.0.1',
                    divDir: 'H',
                    linDiv: {
                      value: '',
                      conditions: [
                        {
                          value: '1:($ZR_CNT_01 * $ZR_STEP ) mm',
                          nodenum: 1,
                          operation: 0,
                          comparisons: [
                            {
                              key: '0',
                              value: '1-$IS_BM_P',
                              operator: '='
                            }
                          ]
                        },
                        {
                          value: '1:($ZB_D + $ZR_STEP ) mm',
                          nodenum: 2,
                          operation: 0,
                          comparisons: [
                            {
                              key: '0',
                              value: '1-$IS_BM_P',
                              operator: '!='
                            }
                          ]
                        }
                      ]
                    },
                    divElem: 0,
                    horDefType: 'D',
                    empty: false,
                    clickable: 'LEFT',
                    modifiable: true,
                    children: [
                      {
                        index: '0.0.1.0.1.0',
                        divDir: 'H',
                        linDiv: {
                          value: '1:($ZR_CNT_02 * $ZR_STEP ) mm'
                        },
                        divElem: 0,
                        horDefType: 'D',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: [
                          {
                            index: '0.0.1.0.1.0.0',
                            divDir: 'H',
                            linDiv: {
                              value: '1:($ZR_CNT_03 * $ZR_STEP ) mm'
                            },
                            divElem: 0,
                            horDefType: 'D',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: [
                              {
                                index: '0.0.1.0.1.0.0.0',
                                divDir: 'H',
                                linDiv: {
                                  value: '1:($ZR_CNT_04* $ZR_STEP ) mm'
                                },
                                divElem: 0,
                                horDefType: 'D',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: [
                                  {
                                    index: '0.0.1.0.1.0.0.0.0',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  },
                                  {
                                    index: '0.0.1.0.1.0.0.0.1',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  }
                                ]
                              },
                              {
                                index: '0.0.1.0.1.0.0.1',
                                divDir: 'H',
                                linDiv: {
                                  value: ''
                                },
                                divElem: 0,
                                horDefType: 'P',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: [
                                  {
                                    index: '0.0.1.0.1.0.0.1.0',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  },
                                  {
                                    index: '0.0.1.0.1.0.0.1.1',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            index: '0.0.1.0.1.0.1',
                            divDir: 'V',
                            linDiv: {
                              value: ''
                            },
                            divElem: 0,
                            horDefType: 'P',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: []
                          }
                        ]
                      },
                      {
                        index: '0.0.1.0.1.1',
                        divDir: 'V',
                        linDiv: {
                          value: ''
                        },
                        divElem: 0,
                        horDefType: 'P',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                index: '0.0.1.1',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: true,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              }
            ]
          }
        ]
      },
      {
        index: '0.1',
        divDir: 'H',
        linDiv: {
          value: '$ZL_D mm : 1'
        },
        divElem: 0,
        horDefType: 'W',
        empty: false,
        clickable: 'FRONT',
        modifiable: false,
        children: [
          {
            index: '0.1.0',
            divDir: 'H',
            linDiv: {
              value: '1:( $IS_BM_N * $ZB_D) mm'
            },
            divElem: 3,
            horDefType: 'D',
            empty: false,
            clickable: 'FRONT',
            modifiable: false,
            children: [
              {
                index: '0.1.0.0',
                divDir: 'H',
                linDiv: {
                  value: '1:((1 - $IS_BM_N )* $ZB_D + $ZL_W)mm'
                },
                divElem: 0,
                horDefType: 'D',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: [
                  {
                    index: '0.1.0.0.0',
                    divDir: 'V',
                    linDiv: {
                      value: ''
                    },
                    divElem: 0,
                    horDefType: 'P',
                    empty: true,
                    clickable: 'FRONT',
                    modifiable: false,
                    children: []
                  },
                  {
                    index: '0.1.0.0.1',
                    divDir: 'H',
                    linDiv: {
                      value: '1:($ZL_CNT_01 * $ZL_STEP ) mm',
                      conditions: [
                        {
                          value: '1:($ZL_CNT_01 * $ZL_STEP ) mm',
                          nodenum: 1,
                          operation: 0,
                          comparisons: [
                            {
                              key: '0',
                              value: '1-$IS_BM_N',
                              operator: '='
                            }
                          ]
                        },
                        {
                          value: '1:($ZB_D +  $ZL_STEP ) mm',
                          nodenum: 2,
                          operation: 0,
                          comparisons: [
                            {
                              key: '0',
                              value: '1-$IS_BM_N',
                              operator: '!='
                            }
                          ]
                        }
                      ]
                    },
                    divElem: 0,
                    horDefType: 'D',
                    empty: false,
                    clickable: 'RIGHT',
                    modifiable: true,
                    children: [
                      {
                        index: '0.1.0.0.1.0',
                        divDir: 'H',
                        linDiv: {
                          value: '1:($ZL_CNT_02 * $ZL_STEP ) mm'
                        },
                        divElem: 0,
                        horDefType: 'D',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: [
                          {
                            index: '0.1.0.0.1.0.0',
                            divDir: 'H',
                            linDiv: {
                              value: '1:($ZL_CNT_03 * $ZL_STEP ) mm'
                            },
                            divElem: 0,
                            horDefType: 'D',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: [
                              {
                                index: '0.1.0.0.1.0.0.0',
                                divDir: 'H',
                                linDiv: {
                                  value: '1:($ZL_CNT_04 * $ZL_STEP ) mm'
                                },
                                divElem: 0,
                                horDefType: 'D',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: []
                              },
                              {
                                index: '0.1.0.0.1.0.0.1',
                                divDir: 'V',
                                linDiv: {
                                  value: ''
                                },
                                divElem: 0,
                                horDefType: 'P',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: [
                                  {
                                    index: '0.1.0.0.1.0.0.1.0',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  },
                                  {
                                    index: '0.1.0.0.1.0.0.1.1',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            index: '0.1.0.0.1.0.1',
                            divDir: 'V',
                            linDiv: {
                              value: ''
                            },
                            divElem: 0,
                            horDefType: 'P',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: []
                          }
                        ]
                      },
                      {
                        index: '0.1.0.0.1.1',
                        divDir: 'V',
                        linDiv: {
                          value: ''
                        },
                        divElem: 0,
                        horDefType: 'P',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                index: '0.1.0.1',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: true,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.2',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.3',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.4',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.5',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.6',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.7',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.1.0.8',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              }
            ]
          },
          {
            index: '0.1.1',
            divDir: 'V',
            linDiv: {
              value: ''
            },
            divElem: 0,
            horDefType: 'P',
            empty: true,
            clickable: 'FRONT',
            modifiable: false,
            children: []
          }
        ]
      },
      {
        index: '0.2',
        divDir: 'H',
        linDiv: {
          value: '1:$ZB_D mm'
        },
        divElem: 3,
        horDefType: 'D',
        empty: false,
        clickable: 'FRONT',
        modifiable: false,
        children: [
          {
            index: '0.2.0',
            divDir: 'V',
            linDiv: {
              value: ''
            },
            divElem: 0,
            horDefType: 'P',
            empty: true,
            clickable: 'FRONT',
            modifiable: false,
            children: []
          },
          {
            index: '0.2.1',
            divDir: 'H',
            linDiv: {
              value: '((1- $IS_BM_N )* $ZL_D) mm : 1: ((1-$IS_BM_P) * $ZR_D) mm'
            },
            divElem: 1,
            horDefType: 'W',
            empty: false,
            clickable: 'FRONT',
            modifiable: false,
            children: [
              {
                index: '0.2.1.0',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: true,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.1',
                divDir: 'H',
                linDiv: {
                  value: '',
                  conditions: [
                    {
                      value: '($ZL_D + $ZB_STEP ) mm:1:($ZR_D + $ZB_STEP ) mm',
                      nodenum: 1,
                      operation: 0,
                      comparisons: [
                        {
                          key: '0',
                          value: '1-$IS_BM_N',
                          operator: '='
                        },
                        {
                          key: '0',
                          value: '1-$IS_BM_P',
                          operator: '='
                        }
                      ]
                    },
                    {
                      value: '($ZL_D + $ZB_STEP ) mm:1:0',
                      nodenum: 2,
                      operation: 0,
                      comparisons: [
                        {
                          key: '0',
                          value: '1-$IS_BM_N',
                          operator: '='
                        },
                        {
                          key: '0',
                          value: '1-$IS_BM_P',
                          operator: '!='
                        }
                      ]
                    },
                    {
                      value: '0:1:($ZR_D + $ZB_STEP )mm',
                      nodenum: 3,
                      operation: 0,
                      comparisons: [
                        {
                          key: '0',
                          value: '1-$IS_BM_N',
                          operator: '!='
                        },
                        {
                          key: '0',
                          value: '1-$IS_BM_P',
                          operator: '='
                        }
                      ]
                    },
                    {
                      value: '($ZB_CNT_01 * $ZB_STEP ) mm:1:0',
                      nodenum: 4,
                      operation: 0,
                      comparisons: [
                        {
                          key: '0',
                          value: '1-$IS_BM_N',
                          operator: '!='
                        },
                        {
                          key: '0',
                          value: '1-$IS_BM_P',
                          operator: '!='
                        }
                      ]
                    }
                  ]
                },
                divElem: 0,
                horDefType: 'W',
                empty: false,
                clickable: 'FRONT',
                modifiable: true,
                children: [
                  {
                    index: '0.2.1.1.0',
                    divDir: 'V',
                    linDiv: {
                      value: ''
                    },
                    divElem: 0,
                    horDefType: 'P',
                    empty: false,
                    clickable: 'FRONT',
                    modifiable: false,
                    children: []
                  },
                  {
                    index: '0.2.1.1.1',
                    divDir: 'H',
                    linDiv: {
                      value: '($ZB_CNT_02 * $ZB_STEP ) mm:1'
                    },
                    divElem: 0,
                    horDefType: 'W',
                    empty: false,
                    clickable: 'FRONT',
                    modifiable: false,
                    children: [
                      {
                        index: '0.2.1.1.1.0',
                        divDir: 'V',
                        linDiv: {
                          value: ''
                        },
                        divElem: 0,
                        horDefType: 'P',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: []
                      },
                      {
                        index: '0.2.1.1.1.1',
                        divDir: 'H',
                        linDiv: {
                          value: '($ZB_CNT_03 * $ZB_STEP ) mm:1'
                        },
                        divElem: 0,
                        horDefType: 'W',
                        empty: false,
                        clickable: 'FRONT',
                        modifiable: false,
                        children: [
                          {
                            index: '0.2.1.1.1.1.0',
                            divDir: 'V',
                            linDiv: {
                              value: ''
                            },
                            divElem: 0,
                            horDefType: 'P',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: []
                          },
                          {
                            index: '0.2.1.1.1.1.1',
                            divDir: 'H',
                            linDiv: {
                              value: '($ZB_CNT_04 * $ZB_STEP ) mm:1'
                            },
                            divElem: 0,
                            horDefType: 'W',
                            empty: false,
                            clickable: 'FRONT',
                            modifiable: false,
                            children: [
                              {
                                index: '0.2.1.1.1.1.1.0',
                                divDir: 'V',
                                linDiv: {
                                  value: ''
                                },
                                divElem: 0,
                                horDefType: 'P',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: []
                              },
                              {
                                index: '0.2.1.1.1.1.1.1',
                                divDir: 'H',
                                linDiv: {
                                  value: '($ZB_CNT_05 * $ZB_STEP ) mm:1'
                                },
                                divElem: 0,
                                horDefType: 'W',
                                empty: false,
                                clickable: 'FRONT',
                                modifiable: false,
                                children: [
                                  {
                                    index: '0.2.1.1.1.1.1.1.0',
                                    divDir: 'V',
                                    linDiv: {
                                      value: ''
                                    },
                                    divElem: 0,
                                    horDefType: 'P',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: []
                                  },
                                  {
                                    index: '0.2.1.1.1.1.1.1.1',
                                    divDir: 'H',
                                    linDiv: {
                                      value: '($ZB_CNT_06 * $ZB_STEP ) mm:1'
                                    },
                                    divElem: 0,
                                    horDefType: 'W',
                                    empty: false,
                                    clickable: 'FRONT',
                                    modifiable: false,
                                    children: [
                                      {
                                        index: '0.2.1.1.1.1.1.1.1.0',
                                        divDir: 'V',
                                        linDiv: {
                                          value: ''
                                        },
                                        divElem: 0,
                                        horDefType: 'P',
                                        empty: false,
                                        clickable: 'FRONT',
                                        modifiable: false,
                                        children: []
                                      },
                                      {
                                        index: '0.2.1.1.1.1.1.1.1.1',
                                        divDir: 'H',
                                        linDiv: {
                                          value: '($ZB_CNT_07 * $ZB_STEP ) mm:1'
                                        },
                                        divElem: 0,
                                        horDefType: 'W',
                                        empty: false,
                                        clickable: 'FRONT',
                                        modifiable: false,
                                        children: [
                                          {
                                            index: '0.2.1.1.1.1.1.1.1.1.0',
                                            divDir: 'V',
                                            linDiv: {
                                              value: ''
                                            },
                                            divElem: 0,
                                            horDefType: 'P',
                                            empty: false,
                                            clickable: 'FRONT',
                                            modifiable: false,
                                            children: []
                                          },
                                          {
                                            index: '0.2.1.1.1.1.1.1.1.1.1',
                                            divDir: 'H',
                                            linDiv: {
                                              value:
                                                '($ZB_CNT_07 * $ZB_STEP ) mm:1'
                                            },
                                            divElem: 0,
                                            horDefType: 'W',
                                            empty: false,
                                            clickable: 'FRONT',
                                            modifiable: false,
                                            children: [
                                              {
                                                index:
                                                  '0.2.1.1.1.1.1.1.1.1.1.0',
                                                divDir: 'V',
                                                linDiv: {
                                                  value: ''
                                                },
                                                divElem: 0,
                                                horDefType: 'P',
                                                empty: false,
                                                clickable: 'FRONT',
                                                modifiable: false,
                                                children: []
                                              },
                                              {
                                                index:
                                                  '0.2.1.1.1.1.1.1.1.1.1.1',
                                                divDir: 'V',
                                                linDiv: {
                                                  value: ''
                                                },
                                                divElem: 0,
                                                horDefType: 'P',
                                                empty: false,
                                                clickable: 'FRONT',
                                                modifiable: false,
                                                children: []
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    index: '0.2.1.1.2',
                    divDir: 'V',
                    linDiv: {
                      value: ''
                    },
                    divElem: 0,
                    horDefType: 'P',
                    empty: false,
                    clickable: 'FRONT',
                    modifiable: false,
                    children: []
                  }
                ]
              },
              {
                index: '0.2.1.10',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.2',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: true,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.3',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.4',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.5',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.6',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.7',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.8',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              },
              {
                index: '0.2.1.9',
                divDir: 'V',
                linDiv: {
                  value: ''
                },
                divElem: 0,
                horDefType: 'P',
                empty: false,
                clickable: 'FRONT',
                modifiable: false,
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  variables: {
    ZB_W: '4000',
    ZL_D: '500',
    ZR_D: '500',
    ZONE_D: '4000',
    ZONE_H: '3000',
    ZB_D: '500',
    IS_BM_N: '0',
    IS_BM_P: '1',
    ZR_W: '3000',
    ZL_W: '2000',
    ZB_STEP: '$ZB_W/$ZB_CNT',
    ZL_CNT_01: '1',
    ZL_STEP: '$ZL_W / $ZL_CNT',
    ZR_CNT_01: '2',
    ZR_STEP: '$ZR_W / $ZR_CNT',
    ZB_CNT: '10',
    ZL_CNT: '4',
    ZL_CNT_02: '2',
    ZB_CNT_01: '1',
    ZL_CNT_03: '1',
    ZR_CNT: '5',
    ZB_CNT_02: '1',
    ZL_CNT_04: '2',
    ZR_CNT_02: '1',
    ZB_CNT_03: '2',
    ZR_CNT_03: '2',
    ZB_CNT_04: '1',
    ZR_CNT_04: '1',
    ZB_CNT_05: '2',
    ZB_CNT_06: '1',
    ZB_CNT_07: '1'
  }
}

export default function Home () {
  return (
    <ZoningProvider initialZone={exampleZone}>
      <div className='w-full h-screen relative'>
        <ZoningScene />
      </div>
    </ZoningProvider>
  )
}
