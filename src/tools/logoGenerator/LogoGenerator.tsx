import { useState } from "react";
import { Switch } from "@headlessui/react";

/*

Should generate a logo like this 

<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <!-- Hand-drawn imperfect circle -->
    <path d="M52,50c2,14,14,27,30,28s28-13,30-28-10-30-28-32-34,10-36,24" 
          stroke="black" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Imperfect green checkmark -->
    <path d="M28,52 Q40,68 44,63 T72,28" 
          stroke="green" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


based on some parameters and random values 
*/

interface LogoParams {
  size: number;
  circleRadius: number;
  strokeWidth: number;
  circleColor: string;
  checkmarkColor: string;
  wobbliness: number;
  checkmarkSize: number;
  isAdvancedMode: boolean;
  tension: number;
  randomSeed: number;
  overdrawSteps: number;
  variation: number;
  checkmarkAngle: number;
  checkmarkBalance: number;
  numPoints: number;
}

const defaultParams: LogoParams = {
  size: 200,
  circleRadius: 40,
  strokeWidth: 3,
  circleColor: "#6e3deb",
  checkmarkColor: "#22C55E",
  wobbliness: 0,
  checkmarkSize: 0.45,
  isAdvancedMode: false,
  tension: 0.5,
  randomSeed: Math.random(),
  overdrawSteps: 1,
  variation: Math.random(),
  checkmarkAngle: 45,
  checkmarkBalance: 0.75,
  numPoints: 46,
};

function catmullRomSpline(
  p0: number[],
  p1: number[],
  p2: number[],
  p3: number[],
  t: number,
  tension: number = 0.5
) {
  const t2 = t * t;
  const t3 = t2 * t;

  const v0 = (p2[0] - p0[0]) * tension;
  const v1 = (p3[0] - p1[0]) * tension;
  const v0y = (p2[1] - p0[1]) * tension;
  const v1y = (p3[1] - p1[1]) * tension;

  const x =
    (2 * p1[0] - 2 * p2[0] + v0 + v1) * t3 +
    (-3 * p1[0] + 3 * p2[0] - 2 * v0 - v1) * t2 +
    v0 * t +
    p1[0];

  const y =
    (2 * p1[1] - 2 * p2[1] + v0y + v1y) * t3 +
    (-3 * p1[1] + 3 * p2[1] - 2 * v0y - v1y) * t2 +
    v0y * t +
    p1[1];

  return [x, y];
}

export default function LogoGenerator() {
  const [params, setParams] = useState<LogoParams>(defaultParams);

  const generateWobblyCircle = (params: LogoParams) => {
    const {
      circleRadius,
      wobbliness,
      size,
      tension,
      randomSeed,
      variation,
      overdrawSteps,
      numPoints,
    } = params;
    const centerX = size / 2;
    const centerY = size / 2;
    const points: [number, number][] = [];
    const startAngle = Math.random() * Math.PI * 2;

    for (let i = 0; i <= numPoints + 2 + overdrawSteps; i++) {
      const angle = startAngle + ((i - 1) / numPoints) * Math.PI * 2;
      const wobble = params.isAdvancedMode
        ? (Math.sin((i + variation) * randomSeed) - 0.5) * wobbliness
        : (Math.random() - 0.5) * wobbliness;
      const r = circleRadius + wobble + (i / numPoints + 2) * -5;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      points.push([x, y]);
    }

    let path = `M ${points[1][0]},${points[1][1]} `;

    for (let i = 0; i < numPoints + overdrawSteps; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const p2 = points[i + 2];
      const p3 = points[i + 3];

      const segments = 10;
      for (let t = 1; t <= segments; t++) {
        const point = catmullRomSpline(p0, p1, p2, p3, t / segments, tension);
        path += `L ${point[0]},${point[1]} `;
      }
    }

    return path;
  };

  const generateCheckmark = (params: LogoParams) => {
    const {
      size,
      checkmarkSize,
      wobbliness,
      checkmarkAngle,
      checkmarkBalance,
    } = params;
    const centerX = size / 2;
    const centerY = size / 2;
    const baseSize = size * 0.4 * checkmarkSize;

    const angleRad = (checkmarkAngle * Math.PI) / 180;
    const wobble = () => (Math.random() - 0.5) * wobbliness;

    const shortArmLength = baseSize * checkmarkBalance;
    const longArmLength = baseSize * (1 + (1 - checkmarkBalance));

    const startX = centerX - baseSize * 0.5;
    const startY = centerY - shortArmLength * 0.2;

    const jointX = centerX - baseSize * 0.15;
    const jointY = centerY + shortArmLength * 0.3;

    const cp1x = startX + wobble();
    const cp1y = centerY + wobble();

    const endX = centerX + longArmLength * Math.cos(angleRad);
    const endY = centerY - longArmLength * Math.sin(angleRad);

    const cp2x =
      jointX + shortArmLength * 0.5 * Math.cos(angleRad * 0.5) + wobble();
    const cp2y =
      jointY - shortArmLength * 0.5 * Math.sin(angleRad * 0.5) + wobble();

    const cp3x = jointX + longArmLength * 0.5 * Math.cos(angleRad) + wobble();
    const cp3y = jointY - longArmLength * 0.5 * Math.sin(angleRad) + wobble();

    return `
      M ${startX},${startY}
      Q ${cp1x},${cp1y} ${jointX},${jointY}
      C ${cp2x},${cp2y} ${cp3x},${cp3y} ${endX},${endY}
    `;
  };

  const generateNewVariation = () => {
    setParams({
      ...params,
      variation: Math.random(),
      randomSeed: params.isAdvancedMode ? params.randomSeed : Math.random(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Logo Preview</h2>
            <button
              onClick={generateNewVariation}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200"
            >
              Generate Variation
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
            <svg
              width={params.size}
              height={params.size}
              viewBox={`0 0 ${params.size} ${params.size}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={generateWobblyCircle(params)}
                stroke={params.circleColor}
                strokeWidth={params.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={generateCheckmark(params)}
                stroke={params.checkmarkColor}
                strokeWidth={params.strokeWidth + 2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setParams({ ...defaultParams })}
              className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Parameters</h2>
            <Switch.Group>
              <div className="flex items-center">
                <Switch.Label className="mr-4 text-sm text-gray-600">
                  Advanced Mode
                </Switch.Label>
                <Switch
                  checked={params.isAdvancedMode}
                  onChange={(checked) => {
                    setParams({
                      ...params,
                      isAdvancedMode: checked,
                      randomSeed: Math.random(),
                    });
                  }}
                  className={`${
                    params.isAdvancedMode ? "bg-indigo-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      params.isAdvancedMode ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </div>

          <div className="space-y-4">
            {/* Basic controls always visible */}

            {/* Advanced controls */}
            {params.isAdvancedMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Circle Radius
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={params.circleRadius}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        circleRadius: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stroke Width
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={params.strokeWidth}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        strokeWidth: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wobbliness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={params.wobbliness}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        wobbliness: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Checkmark Size
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={params.checkmarkSize}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        checkmarkSize: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Random Seed
                  </label>
                  <button
                    onClick={() =>
                      setParams({ ...params, randomSeed: Math.random() })
                    }
                    className="mt-1 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Generate New Seed
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Overdraw Steps
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="45"
                    value={params.overdrawSteps}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        overdrawSteps: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">
                    {params.overdrawSteps} step
                    {params.overdrawSteps !== 1 ? "s" : ""}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Checkmark Angle
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="190"
                    value={params.checkmarkAngle}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        checkmarkAngle: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">
                    {params.checkmarkAngle}°
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Checkmark Balance
                  </label>
                  <input
                    type="range"
                    min="-1"
                    max="2"
                    step="0.1"
                    value={params.checkmarkBalance}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        checkmarkBalance: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Circle Smoothness
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="120"
                    value={params.numPoints}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        numPoints: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">
                    {params.numPoints} points
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Style
                  </label>
                  <select
                    value={params.wobbliness}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        wobbliness: Number(e.target.value),
                        tension: 0.5,
                        overdrawSteps: Number(e.target.value) + 1,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="0">Neat</option>
                    <option value="1">Casual</option>
                    <option value="2">Playful</option>
                    <option value="8">Wild</option>
                  </select>
                </div>
              </div>
            )}

            {/* Color controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Circle Color
                </label>
                <input
                  type="color"
                  value={params.circleColor}
                  onChange={(e) =>
                    setParams({ ...params, circleColor: e.target.value })
                  }
                  className="w-full h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Checkmark Color
                </label>
                <input
                  type="color"
                  value={params.checkmarkColor}
                  onChange={(e) =>
                    setParams({ ...params, checkmarkColor: e.target.value })
                  }
                  className="w-full h-10 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
