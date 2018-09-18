import {Render} from "./cervus/components";
import {Box} from "./cervus/shapes";
import {wireframe_material} from "./materials";

let cube_render = (new Box()).components.get(Render);

export default 
function create_gizmo() {
    return new Render({
        color: "fff",
        material: wireframe_material,
        indices: cube_render.indices,
        vertices: cube_render.vertices
    });
}
