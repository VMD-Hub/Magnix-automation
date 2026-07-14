/**
 * Build id inject từ vite.config (`__HX_BUILD_ID__`).
 * Hiển thị để biết đã load đúng bundle sau zmp deploy.
 */
declare const __HX_BUILD_ID__: string;

export function getHxBuildId(): string {
  return typeof __HX_BUILD_ID__ !== "undefined" ? __HX_BUILD_ID__ : "dev";
}
