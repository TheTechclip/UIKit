declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "maplibre-gl/dist/maplibre-gl.css" {
  const content: string;
  export default content;
}
