import { useControls, folder } from "leva";
import React, { useState, useMemo } from "react";
import _ from "lodash";

interface GradientEffect {
  id: string;
  type: "gradient";
  colors: string[];
  opacity: number;
  gradientType: string;
  angle: number;
}

interface PatternEffect {
  id: string;
  type: "pattern";
  shape: "circle" | "square";
  count: number;
  size: number;
  opacity: number;
  color: string;
}

type Effect = GradientEffect | PatternEffect;

class ThumbnailsEffects {
  generate(params) {
    const patternStyle = params.patternStyle || "uniform";
    const colorStyle = params.colorStyle || "solid";
    const visibilityStyle = params.visibilityStyle || "full";

    const width = Number(params.width) || 200;
    const height = Number(params.height) || 200;

    return [
      {
        id: "gradient",
        type: "gradient",
        colors: params.gradientColors,
        opacity: params.gradientOpacity,
        gradientType: params.gradientType,
        angle: params.gradientAngle,
      },
      {
        id: "pattern",
        type: "pattern",
        shape: params.shape || params.patternShape,
        count: Number(params.patternCount) || 5,
        size: Number(params.patternSize) || 10,
        opacity: Number(params.patternOpacity) || 0.3,
        color: params.patternColor,
        width,
        height,
        gridFns: {
          size: patternGridFns.size[patternStyle](width, height),
          color: patternGridFns.colors[colorStyle]([
            params.patternColor,
            ...(params.gradientColors || []),
          ]),
          visibility: patternGridFns.visibility[visibilityStyle](width, height),
        },
      },
    ];
  }
}

const useThumbnailEffects = (params) => {
  return useMemo(() => {
    const generator = new ThumbnailsEffects();
    return generator.generate(params);
  }, [params]);
};

const gradients = {
  linear: ({ colors, angle = 45 }) =>
    `linear-gradient(${angle}deg, ${colors.join(", ")})`,

  radial: ({ colors, position = "bottom left" }) =>
    `radial-gradient(141.4% 141.4% at ${position}, ${colors.join(", ")})`,

  conic: ({ colors, position = "50% 50%", angle = 0 }) =>
    `conic-gradient(from ${angle}deg at ${position}, ${colors.join(", ")})`,

  diagonal: ({ colors }) => `linear-gradient(135deg, ${colors.join(", ")})`,

  spotlight: ({ colors }) =>
    `radial-gradient(circle at 0% 100%, ${colors.join(", ")})`,
};

const shapes = {
  circle: (x: number, y: number, size: number) => ({
    element: "circle",
    attrs: { cx: x, cy: y, r: size },
  }),

  square: (x: number, y: number, size: number) => ({
    element: "rect",
    attrs: { x: x - size / 2, y: y - size / 2, width: size, height: size },
  }),

  diamond: (x: number, y: number, size: number) => ({
    element: "rect",
    attrs: {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      transform: `rotate(45 ${x} ${y})`,
    },
  }),

  cross: (x: number, y: number, size: number) => ({
    element: "path",
    attrs: {
      d: `M${x - size / 2},${y} h${size} M${x},${y - size / 2} v${size}`,
    },
  }),
};

const patternGridFns = {
  size: {
    uniform: () => (x: number, y: number) => 1,

    smallOnCorners:
      (width: number, height: number) => (x: number, y: number) => {
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
        );
        return (
          1 - distanceFromCenter / Math.sqrt(width * width + height * height)
        );
      },

    wave: () => (x: number, y: number) =>
      Math.abs(Math.sin(x * 0.1) * Math.cos(y * 0.1)),

    spiral: () => (x: number, y: number, width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const angle = Math.atan2(y - centerY, x - centerX);
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      return 0.5 + 0.5 * Math.sin(distance * 0.1 + angle);
    },
    ripple: () => (x: number, y: number) => {
      const distance = Math.sqrt(x * x + y * y);
      return 0.5 + 0.5 * Math.sin(distance * 0.1);
    },
  },

  colors: {
    solid: (color: string) => () => color,

    gradient:
      (colors: string[]) =>
      (x: number, y: number, width: number, height: number) => {
        const progress = (x + y) / (width + height);
        const index = Math.floor(progress * (colors.length - 1));
        return colors[index];
      },

    random: (colors: string[]) => () =>
      colors[Math.floor(Math.random() * colors.length)],

    rainbow: (colors: string[]) => (x: number, y: number, width: number) => {
      const hue = (x / width) * 360;
      return `hsl(${hue}, 70%, 50%)`;
    },
    distance:
      (colors: string[]) =>
      (x: number, y: number, width: number, height: number) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDistance = Math.sqrt(
          Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
        );
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const index = Math.floor(
          (distance / maxDistance) * (colors.length - 1)
        );
        return colors[Math.min(index, colors.length - 1)];
      },
  },

  visibility: {
    full: () => () => true,

    corners: (width: number, height: number) => (x: number, y: number) => {
      const distanceFromCorner = Math.min(
        Math.sqrt(x * x + y * y),
        Math.sqrt(Math.pow(width - x, 2) + y * y),
        Math.sqrt(x * x + Math.pow(height - y, 2)),
        Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2))
      );
      return distanceFromCorner < Math.min(width, height) / 3;
    },

    checkerboard: () => (x: number, y: number, size: number) =>
      (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0,

    diagonal: () => (x: number, y: number, size: number) =>
      (x + y) % (size * 3) < size * 2,
    radial: (width: number, height: number) => (x: number, y: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      return distance % 50 < 25;
    },
  },
};

const Gradient = ({
  colors = ["#000000", "#ffffff"],
  opacity = 0.5,
  type = "radial",
  angle = 45,
  position = "bottom left",
}) => {
  if (!colors || colors.length < 2) {
    colors = ["#000000", "#ffffff"];
  }

  const gradientFn = gradients[type] || gradients.radial;
  const background = gradientFn({ colors, angle, position });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background,
        opacity,
        mixBlendMode: "multiply",
        zIndex: 2,
      }}
    />
  );
};

const Pattern = ({
  shape,
  count,
  size,
  opacity,
  color,
  gridFns = {},
  width,
  height,
}) => {
  const safeCount = Number(count) || 5;
  const safeSize = Number(size) || 10;
  const safeOpacity = Number(opacity) || 0.3;
  const safeWidth = Number(width) || 200;
  const safeHeight = Number(height) || 200;

  const sizeFunc =
    typeof gridFns.size === "function"
      ? gridFns.size
      : patternGridFns.size.uniform()(safeWidth, safeHeight);
  const colorFunc =
    typeof gridFns.color === "function"
      ? gridFns.color
      : patternGridFns.colors.solid(color);
  const visibilityFunc =
    typeof gridFns.visibility === "function"
      ? gridFns.visibility
      : patternGridFns.visibility.full();

  const patterns = [];
  const spacing = size * 2;
  const shapeGenerator = shapes[shape] || shapes.circle;

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const x = spacing + i * spacing;
      const y = spacing + j * spacing;

      if (visibilityFunc(x, y, spacing, width, height)) {
        const currentSize = size * sizeFunc(x, y, width, height);
        const currentColor = colorFunc(x, y, width, height);
        const { element, attrs } = shapeGenerator(x, y, currentSize);

        patterns.push(
          React.createElement(element, {
            key: `${i}-${j}`,
            ...attrs,
            fill: currentColor,
            opacity,
            style: { transition: "all 0.3s ease" },
          })
        );
      }
    }
  }

  return <>{patterns}</>;
};

const Thumbnail = ({ url, effects, width = 200, height = 200 }) => {
  const gradientEffect = effects.find((e) => e.type === "gradient");
  const patternEffect = effects.find((e) => e.type === "pattern");

  return (
    <div style={{ position: "relative", width, height }}>
      <img
        src={url}
        style={{ width, height, position: "absolute", zIndex: 1 }}
      />
      {gradientEffect && <Gradient {...gradientEffect} />}
      {patternEffect && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", zIndex: 3 }}
          viewBox={`0 0 ${width} ${height}`}
        >
          <Pattern {...patternEffect} />
        </svg>
      )}
    </div>
  );
};

const ThumbnailGenerator = () => {
  const params = useControls({
    width: { value: 200, min: 100, max: 500 },
    height: { value: 200, min: 100, max: 500 },
    gradientColors: {
      value: "#ff0000",
    },
    gradientColor2: {
      value: "#0000ff",
    },
    gradientOpacity: { value: 0.8, min: 0, max: 1, step: 0.1 },
    patternShape: { options: ["circle", "square"] },
    patternCount: { value: 5, min: 1, max: 10, step: 1 },
    patternSize: { value: 10, min: 5, max: 50 },
    patternOpacity: { value: 0.3, min: 0, max: 1 },
    patternColor: { value: "#000000" },
    gradientType: { options: Object.keys(gradients) },
    gradientAngle: { value: 45, min: 0, max: 360 },
    shape: { options: Object.keys(shapes) },
    patternStyle: {
      value: "uniform",
      options: ["uniform", "smallOnCorners", "wave", "spiral", "ripple"],
    },
    colorStyle: {
      value: "solid",
      options: ["solid", "gradient", "random", "rainbow", "distance"],
    },
    visibilityStyle: {
      value: "full",
      options: ["full", "corners", "checkerboard", "diagonal", "radial"],
    },
  });

  const effects = useThumbnailEffects({
    ...params,
    gradientColors: [params.gradientColors, params.gradientColor2],
    gradientOpacity: params.gradientOpacity,
  });

  return (
    <div>
      <Thumbnail
        url={`https://picsum.photos/${params.width}/${params.height}`}
        effects={effects}
        width={params.width}
        height={params.height}
      />
    </div>
  );
};

export default ThumbnailGenerator;
