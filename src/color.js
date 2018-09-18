import {float} from "./cervus/core";
import {rgb_to_hex, hsl_to_rgb} from "./cervus/utils";
import {
    HUE_MIN,
    HUE_MAX,
    SATURATION,
    LUMINANCE} from "./config";

export function random_color() {
    let hue = float(HUE_MIN, HUE_MAX);
    return rgb_to_hex(
        hsl_to_rgb(hue > 0 ? hue + 1 : hue, SATURATION, LUMINANCE));
}
