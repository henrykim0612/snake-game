use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// 빌드 명령어: wasm-pack build --target web

// #[wasm_bindgen]
// pub fn greet(name: &str) {
//     alert(name);
// }
//
// #[wasm_bindgen]
// extern {
//     pub fn alert(s: &str);
// }


#[wasm_bindgen]
pub struct World {
    pub width: usize
}

#[wasm_bindgen]
impl World {
    pub fn new() -> Self {
        World { width: 8 }
    }
}
